import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { TransactionDoc } from "../../db/DocType";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    page: number;
    itemsPerPage: number;
    onTransactions: (transactions: TransactionDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTransactionsInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onTransactions, dispatch, page, itemsPerPage } = this.props;
        apiRequest({
            path: `txs?page=${page}&itemsPerPage=${itemsPerPage}`,
            dispatch,
            showProgressBar: true
        })
            .then((response: any) => {
                onTransactions(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestTransactions = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestTransactionsInternal);

export default RequestTransactions;
