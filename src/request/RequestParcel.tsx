import { H256 } from "codechain-sdk/lib/core/classes";
import * as _ from "lodash";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AssetMintTransactionDoc, AssetTransactionGroupDoc, ParcelDoc } from "codechain-es/lib/types";
import { Type } from "codechain-es/lib/utils";
import { RootState } from "../redux/actions";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    hash: string;
    onParcel: (parcel: ParcelDoc) => void;
    onParcelNotExist: () => void;
    onError: (e: ApiError) => void;
    progressBarTarget?: string;
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
        const { cached, dispatch, hash, onParcel, onParcelNotExist, onError, progressBarTarget } = this.props;
        if (cached) {
            setTimeout(() => onParcel(cached));
            return;
        }
        apiRequest({
            path: `parcel/${hash}`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: ParcelDoc) => {
                if (response === null) {
                    return onParcelNotExist();
                }
                const parcel = response;
                dispatch({
                    type: "CACHE_PARCEL",
                    data: parcel
                });
                if (Type.isAssetTransactionGroupDoc(parcel.action)) {
                    _.each((parcel.action as AssetTransactionGroupDoc).transactions, transaction => {
                        dispatch({
                            type: "CACHE_TRANSACTION",
                            data: transaction
                        });

                        if (Type.isAssetMintTransactionDoc(transaction)) {
                            dispatch({
                                type: "CACHE_ASSET_SCHEME",
                                data: {
                                    assetType: (transaction as AssetMintTransactionDoc).data.output.assetType,
                                    assetScheme: Type.getAssetSchemeDoc(transaction as AssetMintTransactionDoc)
                                }
                            });
                        }
                    });
                }
                onParcel(parcel);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestParcel = connect(
    (state: RootState, props: OwnProps) => {
        if (Type.isH256String(props.hash)) {
            return {
                cached: state.appReducer.parcelByHash[new H256(props.hash).value]
            };
        }
        return { cached: state.appReducer.parcelByHash[props.hash] };
    },
    (dispatch: Dispatch) => ({ dispatch })
)(RequestParcelInternal);

export default RequestParcel;
