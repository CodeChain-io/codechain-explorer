import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { PendingTransactionDoc } from "codechain-es/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    onPendingTransaction: (pendingTransactionDoc: PendingTransactionDoc) => void;
    onError: (e: ApiError) => void;
    onPendingTransactionNotExist: () => void;
    progressBarTarget?: string;
    hash: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPendingTransactionInternal extends React.Component<Props> {
    public componentWillMount() {
        const {
            onPendingTransaction,
            onError,
            hash,
            onPendingTransactionNotExist,
            dispatch,
            progressBarTarget
        } = this.props;
        apiRequest({
            path: `tx/pending/${hash}`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: any) => {
                if (response === null) {
                    return onPendingTransactionNotExist();
                }
                onPendingTransaction(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestPendingTransaction = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestPendingTransactionInternal);

export default RequestPendingTransaction;
