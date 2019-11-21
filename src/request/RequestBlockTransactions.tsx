import * as _ from "lodash";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";
import { TransactionsResponse } from "./RequestTransactions";

interface OwnProps {
    id: number | string;
    firstEvaluatedKey?: string;
    lastEvaluatedKey?: string;
    itemsPerPage: number;
    onTransactions: (response: TransactionsResponse) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;
class RequestBlockTransactions extends React.Component<Props> {
    public componentWillMount() {
        const { id, lastEvaluatedKey, firstEvaluatedKey, itemsPerPage, dispatch } = this.props;
        const { onError, onTransactions } = this.props;
        apiRequest({
            path: `block/${id}/tx?itemsPerPage=${itemsPerPage}${
                lastEvaluatedKey ? `&lastEvaluatedKey=${lastEvaluatedKey}` : ""
            }${firstEvaluatedKey ? `&firstEvaluatedKey=${firstEvaluatedKey}` : ""}`,
            dispatch,
            showProgressBar: false
        })
            .then(onTransactions)
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestBlockTransactions);
