import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    onTransactionTotalCount: (transactionTotalCount: number) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTotalTransactionCountInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onTransactionTotalCount, dispatch } = this.props;
        apiRequest({ path: `txs/totalCount`, dispatch, showProgressBar: true }).then((response: any) => {
            onTransactionTotalCount(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestTotalTransactionCount = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestTotalTransactionCountInternal);

export default RequestTotalTransactionCount;
