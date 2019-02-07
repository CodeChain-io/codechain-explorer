import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { TransactionDoc } from "codechain-indexer-types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    page: number;
    itemsPerPage: number;
    lastBlockNumber?: number;
    lastTransactionIndex?: number;
    onTransactions: (transactions: TransactionDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTransactions extends React.Component<Props> {
    public componentWillMount() {
        const {
            onError,
            onTransactions,
            dispatch,
            page,
            itemsPerPage,
            lastBlockNumber,
            lastTransactionIndex
        } = this.props;
        let path = `txs?page=${page}&itemsPerPage=${itemsPerPage}`;
        if (lastBlockNumber) {
            path += `&lastBlockNumber=${lastBlockNumber}`;
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

export default connect()(RequestTransactions);
