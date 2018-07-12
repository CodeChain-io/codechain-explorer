import * as React from "react";
import * as _ from "lodash";

import { Transaction } from "codechain-sdk/lib/core/classes";

import { apiRequest, ApiError } from "./ApiRequest";
import { getTransactionFromJSON } from "codechain-sdk/lib/core/transaction/Transaction";

interface OwnProps {
    address: string;
    onTransactions: (transactions: Transaction[]) => void;
    onError: (e: ApiError) => void;
}

class RequestAssetTransferAddressTransactions extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onTransactions, onError } = this.props;
        apiRequest({ path: `addr-asset-txs/${address}` }).then((response) => {
            onTransactions(_.map(response, res => getTransactionFromJSON(res)));
        }).catch(onError);
    }
    public render() {
        return (null);
    }
}

export default RequestAssetTransferAddressTransactions;
