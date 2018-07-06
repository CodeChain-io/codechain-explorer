import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { Transaction, SDK } from "codechain-sdk";

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
            const transaction = SDK.getTransactionFromJSON(response);
            dispatch({
                type: "CACHE_TRANSACTION",
                data: transaction
            });
            onTransaction(transaction);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestTransaction = connect((state: RootState, props: OwnProps) => {
    return { cached: state.transactionByHash[props.hash] };
}, (dispatch: Dispatch) => ({ dispatch }))(RequestTransactionInternal);

export default RequestTransaction;
