import { TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { ApiError, apiRequest } from "./ApiRequest";

export interface TransactionsResponse {
    data: TransactionDoc[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    firstEvaluatedKey: string;
    lastEvaluatedKey: string;
}

interface OwnProps {
    firstEvaluatedKey?: string;
    lastEvaluatedKey?: string;
    itemsPerPage: number;
    showProgressBar: boolean;
    onTransactions: (transactions: TransactionsResponse) => void;
    onError: (e: ApiError) => void;
    selectedTypes?: string[];
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
            lastEvaluatedKey,
            firstEvaluatedKey,
            itemsPerPage,
            showProgressBar,
            selectedTypes
        } = this.props;
        let path = `tx?itemsPerPage=${itemsPerPage}${lastEvaluatedKey ? `&lastEvaluatedKey=${lastEvaluatedKey}` : ""}${
            firstEvaluatedKey ? `&firstEvaluatedKey=${firstEvaluatedKey}` : ""
        }`;
        if (selectedTypes && selectedTypes.length > 0) {
            path += `&type=${selectedTypes.join(",")}`;
        }
        apiRequest({
            path,
            dispatch,
            showProgressBar
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
