import * as React from "react";

import { apiRequest, ApiError } from "./ApiRequest";
import { PendingTransactionDoc } from "../../db/DocType";

interface OwnProps {
    onPendingTransaction: (pendingTransactionDoc: PendingTransactionDoc) => void;
    onError: (e: ApiError) => void;
    onPendingTransactionNotExist: () => void;
    hash: string;
}

class RequestPendingTransaction extends React.Component<OwnProps> {
    public componentWillMount() {
        const { onPendingTransaction, onError, hash, onPendingTransactionNotExist } = this.props;
        apiRequest({ path: `tx/pending/${hash}` }).then((response: any) => {
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

export default RequestPendingTransaction;
