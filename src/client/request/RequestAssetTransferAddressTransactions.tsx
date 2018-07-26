import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { TransactionDoc } from "../../db/DocType";

interface OwnProps {
    address: string;
    onTransactions: (transactions: TransactionDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestAssetTransferAddressTransactionsInternal extends React.Component<Props> {
    public componentWillMount() {
        const { address, onTransactions, onError, dispatch } = this.props;
        apiRequest({ path: `addr-asset-txs/${address}`, dispatch }).then((response: TransactionDoc[]) => {
            onTransactions(response);
        }).catch(onError);
    }
    public render() {
        return (null);
    }
}

const RequestAssetTransferAddressTransactions = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestAssetTransferAddressTransactionsInternal);

export default RequestAssetTransferAddressTransactions;
