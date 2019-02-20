import { TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    page: number;
    itemsPerPage: number;
    onTransactions: (transactions: TransactionDoc[]) => void;
    onError: (e: ApiError) => void;
    selectedTypes?: string[];
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTransactions extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onTransactions, dispatch, page, itemsPerPage, selectedTypes } = this.props;
        let path = `tx?page=${page}&itemsPerPage=${itemsPerPage}`;
        if (selectedTypes && selectedTypes.length > 0) {
            path += `&type=${selectedTypes.join(",")}`;
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
