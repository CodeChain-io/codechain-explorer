import * as React from "react";
import * as _ from "lodash";
import { connect, Dispatch } from "react-redux";
import { H256 } from "codechain-sdk/lib/core/classes";

import { RootState } from "../redux/actions";
import { ApiError, apiRequest } from "./ApiRequest";
import { ParcelDoc, ChangeShardStateDoc, Type, AssetMintTransactionDoc } from "../db/DocType";

interface OwnProps {
    hash: string;
    onParcel: (parcel: ParcelDoc) => void;
    onParcelNotExist: () => void;
    onError: (e: ApiError) => void;
}

interface StateProps {
    cached?: ParcelDoc;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class RequestParcelInternal extends React.Component<Props> {
    public componentWillMount() {
        const { cached, dispatch, hash, onParcel, onParcelNotExist, onError } = this.props;
        if (cached) {
            setTimeout(() => onParcel(cached));
            return;
        }
        apiRequest({ path: `parcel/${hash}` }).then((response: ParcelDoc) => {
            if (response === null) {
                return onParcelNotExist();
            }
            const parcel = response;
            dispatch({
                type: "CACHE_PARCEL",
                data: parcel
            });
            if (Type.isChangeShardStateDoc(parcel.action)) {
                _.each((parcel.action as ChangeShardStateDoc).transactions, (transaction) => {
                    dispatch({
                        type: "CACHE_TRANSACTION",
                        data: transaction
                    })

                    if (Type.isAssetMintTransactionDoc(transaction)) {
                        dispatch({
                            type: "CACHE_ASSET_SCHEME",
                            data: {
                                assetType: (transaction as AssetMintTransactionDoc).data.output.assetType,
                                assetScheme: Type.getAssetSchemeDoc(transaction as AssetMintTransactionDoc)
                            }
                        })
                    }
                })
            }
            onParcel(parcel);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestParcel = connect((state: RootState, props: OwnProps) => {
    if (props.hash.length === 66 || props.hash.length === 64) {
        return { cached: state.parcelByHash[new H256(props.hash).value] };
    }
    return { cached: state.parcelByHash[props.hash] };
}, (dispatch: Dispatch) => ({ dispatch }))(RequestParcelInternal);

export default RequestParcel;
