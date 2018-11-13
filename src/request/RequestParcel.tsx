import { H256 } from "codechain-sdk/lib/core/classes";
import * as _ from "lodash";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AssetMintTransactionDoc, ParcelDoc } from "codechain-indexer-types/lib/types";
import { Type } from "codechain-indexer-types/lib/utils";
import { RootState } from "../redux/actions";
import { getCurrentTimestamp } from "../utils/Time";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    hash: string;
    onParcel: (parcel: ParcelDoc) => void;
    onParcelNotExist: () => void;
    onError: (e: ApiError) => void;
    progressBarTarget?: string;
}

interface StateProps {
    cached?: { data: ParcelDoc; updatedAt: number };
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class RequestParcel extends React.Component<Props> {
    public componentWillMount() {
        const { cached, dispatch, hash, onParcel, onParcelNotExist, onError, progressBarTarget } = this.props;
        if (cached && getCurrentTimestamp() - cached.updatedAt < 10) {
            setTimeout(() => onParcel(cached.data));
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
                if (Type.isAssetTransactionDoc(parcel.action)) {
                    const transaction = parcel.action.transaction;
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
                }
                onParcel(parcel);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect((state: RootState, props: OwnProps) => {
    let cacheKey = props.hash;
    if (Type.isH256String(cacheKey)) {
        cacheKey = new H256(cacheKey).value;
    }
    const cachedParcel = state.appReducer.parcelByHash[cacheKey];
    return {
        cached: cachedParcel && {
            data: cachedParcel.data,
            updatedAt: cachedParcel.updatedAt
        }
    };
})(RequestParcel);
