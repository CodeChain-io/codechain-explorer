import { H256 } from "codechain-sdk/lib/core/classes";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AssetMintTransactionDoc, TransactionDoc } from "codechain-indexer-types/lib/types";
import { Type } from "codechain-indexer-types/lib/utils";
import { RootState } from "../redux/actions";
import { getCurrentTimestamp } from "../utils/Time";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    hash: string;
    onTransaction: (transaction: TransactionDoc) => void;
    onTransactionNotExist: () => void;
    onError: (e: ApiError) => void;
    progressBarTarget?: string;
}

interface StateProps {
    cached?: { data: TransactionDoc; updatedAt: number };
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class RequestTransaction extends React.Component<Props> {
    public componentWillMount() {
        const { cached, dispatch, hash, onTransaction, onTransactionNotExist, onError, progressBarTarget } = this.props;
        if (cached && getCurrentTimestamp() - cached.updatedAt < 10) {
            setTimeout(() => onTransaction(cached.data));
            return;
        }
        apiRequest({
            path: `tx/${hash}`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: TransactionDoc) => {
                if (response === null) {
                    return onTransactionNotExist();
                }
                const transaction = response;
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
                onTransaction(transaction);
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
    const cachedTx = state.appReducer.transactionByHash[cacheKey];
    return {
        cached: cachedTx && {
            data: cachedTx.data,
            updatedAt: cachedTx.updatedAt
        }
    };
})(RequestTransaction);
