import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { ApiError, apiRequest } from "./ApiRequest";
import { TransactionsResponse } from "./RequestTransactions";

interface OwnProps {
    firstEvaluatedKey?: string;
    lastEvaluatedKey?: string;
    itemsPerPage: number;
    onTransactions: (transactions: TransactionsResponse) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPendingTransactions extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onTransactions, dispatch, lastEvaluatedKey, firstEvaluatedKey, itemsPerPage } = this.props;
        const path = `pending-tx?
            itemsPerPage=${itemsPerPage}${lastEvaluatedKey ? `&lastEvaluatedKey=${lastEvaluatedKey}` : ""}${
            firstEvaluatedKey ? `&firstEvaluatedKey=${firstEvaluatedKey}` : ""
        }`;
        apiRequest({
            path,
            dispatch,
            showProgressBar: false
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

export default connect()(RequestPendingTransactions);
