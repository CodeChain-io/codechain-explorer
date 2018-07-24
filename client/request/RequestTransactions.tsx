import * as React from "react";

import { apiRequest, ApiError } from "./ApiRequest";
import { TransactionDoc } from "db/DocType";

interface OwnProps {
    onTransactions: (transactions: TransactionDoc[]) => void;
    onError: (e: ApiError) => void;
}

class RequestTransactions extends React.Component<OwnProps> {
    public componentWillMount() {
        const { onError, onTransactions } = this.props;
        apiRequest({ path: `txs` }).then((response: any) => {
            onTransactions(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestTransactions;
