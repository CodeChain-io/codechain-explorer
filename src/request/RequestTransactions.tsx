import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { TransactionDoc } from "codechain-es/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    page: number;
    itemsPerPage: number;
    lastBlockNumber?: number;
    lastParcelIndex?: number;
    lastTransactionIndex?: number;
    onTransactions: (transactions: TransactionDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTransactionsInternal extends React.Component<Props> {
    public componentWillMount() {
        const {
            onError,
            onTransactions,
            dispatch,
            page,
            itemsPerPage,
            lastBlockNumber,
            lastParcelIndex,
            lastTransactionIndex
        } = this.props;
        let path = `txs?page=${page}&itemsPerPage=${itemsPerPage}`;
        if (lastBlockNumber) {
            path += `&lastBlockNumber=${lastBlockNumber}`;
        }
        if (lastParcelIndex) {
            path += `&lastParcelIndex=${lastParcelIndex}`;
        }
        if (lastTransactionIndex) {
            path += `&lastTransactionIndex=${lastTransactionIndex}`;
        }
        apiRequest({
            path,
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
