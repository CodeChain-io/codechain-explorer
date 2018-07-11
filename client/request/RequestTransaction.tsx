import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { Transaction, H256, AssetMintTransaction } from "codechain-sdk/lib/core/classes";
import { getTransactionFromJSON } from "codechain-sdk/lib/core/transaction/Transaction";

import { RootState } from "../redux/actions";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    hash: string;
    onTransaction: (transaction: Transaction) => void;
    onTransactionNotExist: () => void;
    onError: (e: ApiError) => void;
}

interface StateProps {
    cached?: Transaction;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class RequestTransactionInternal extends React.Component<Props> {
    public componentWillMount() {
        const { cached, dispatch, hash, onTransaction, onTransactionNotExist, onError } = this.props;
        if (cached) {
            setTimeout(() => onTransaction(cached));
            return;
        }
        apiRequest({ path: `tx/${hash}` }).then((response: { type: string, data: object }) => {
            if (response === null) {
                return onTransactionNotExist();
            }
            // FIXME: Modify to using static sdk function without sdk object.
            const transaction = getTransactionFromJSON(response);
            dispatch({
                type: "CACHE_TRANSACTION",
                data: transaction
            });

            if (transaction instanceof AssetMintTransaction) {
                dispatch({
                    type: "CACHE_ASSET_SCHEME",
                    data: {
                        assetType: transaction.getAssetSchemeAddress().value,
                        assetScheme: transaction.getAssetScheme()
                    }
                })
            }
            onTransaction(transaction);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestTransaction = connect((state: RootState, props: OwnProps) => {
    if (props.hash.length === 66 || props.hash.length === 64) {
        return { cached: state.transactionByHash[new H256(props.hash).value] };
    }
    return { cached: state.transactionByHash[props.hash] };
}, (dispatch: Dispatch) => ({ dispatch }))(RequestTransactionInternal);

export default RequestTransaction;
