import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { PendingTransactionDoc } from "../../db/DocType";

interface OwnProps {
    onPendingTransaction: (pendingTransactionDoc: PendingTransactionDoc) => void;
    onError: (e: ApiError) => void;
    onPendingTransactionNotExist: () => void;
    hash: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPendingTransactionInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onPendingTransaction, onError, hash, onPendingTransactionNotExist, dispatch } = this.props;
        apiRequest({ path: `tx/pending/${hash}`, dispatch }).then((response: any) => {
            if (response === null) {
                onPendingTransactionNotExist();
            }
            onPendingTransaction(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestPendingTransaction = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestPendingTransactionInternal);

export default RequestPendingTransaction;
