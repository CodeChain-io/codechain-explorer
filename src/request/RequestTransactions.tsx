import { TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
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

class RequestTransactions extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onTransactions, dispatch, page, itemsPerPage } = this.props;
        const path = `tx?page=${page}&itemsPerPage=${itemsPerPage}`;
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
