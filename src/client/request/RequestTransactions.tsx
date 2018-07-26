import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { TransactionDoc } from "../../db/DocType";

interface OwnProps {
    onTransactions: (transactions: TransactionDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTransactionsInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onTransactions, dispatch } = this.props;
        apiRequest({ path: `txs`, dispatch }).then((response: any) => {
            onTransactions(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestTransactions = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestTransactionsInternal);

export default RequestTransactions;
