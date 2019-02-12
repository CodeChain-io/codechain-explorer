import { H256 } from "codechain-sdk/lib/core/classes";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { TransactionDoc } from "codechain-indexer-types";
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
            .then(async (response: TransactionDoc) => {
                if (response === null) {
                    return onTransactionNotExist();
                }
                const transaction = response;

                // FIXME: This is temporary code. https://github.com/CodeChain-io/codechain-indexer/issues/57
                if (transaction.type === "transferAsset") {
                    await Promise.all(
                        transaction.transferAsset.outputs.map(async output => {
                            const assetScheme: any = await apiRequest({
                                path: `asset-scheme/${output.assetType}`,
                                dispatch,
                                showProgressBar: false
                            });
                            output.assetScheme = assetScheme;
                        })
                    );
                }

                dispatch({
                    type: "CACHE_TRANSACTION",
                    data: transaction
                });

                if (transaction.type === "mintAsset") {
                    dispatch({
                        type: "CACHE_ASSET_SCHEME",
                        data: {
                            assetType: transaction.mintAsset.assetType,
                            assetScheme: transaction.mintAsset
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
    let cachedTx;
    try {
        const cacheKey = new H256(props.hash).value;
        cachedTx = state.appReducer.transactionByHash[cacheKey];
    } catch (e) {
        //
    }
    return {
        cached: cachedTx && {
            data: cachedTx.data,
            updatedAt: cachedTx.updatedAt
        }
    };
})(RequestTransaction);
