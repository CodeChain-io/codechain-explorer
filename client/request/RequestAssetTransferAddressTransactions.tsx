import * as React from "react";

import { apiRequest, ApiError } from "./ApiRequest";
import { TransactionDoc } from "../db/DocType";

interface OwnProps {
    address: string;
    onTransactions: (transactions: TransactionDoc[]) => void;
    onError: (e: ApiError) => void;
}

class RequestAssetTransferAddressTransactions extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onTransactions, onError } = this.props;
        apiRequest({ path: `addr-asset-txs/${address}` }).then((response: TransactionDoc[]) => {
            onTransactions(response);
        }).catch(onError);
    }
    public render() {
        return (null);
    }
}

export default RequestAssetTransferAddressTransactions;
