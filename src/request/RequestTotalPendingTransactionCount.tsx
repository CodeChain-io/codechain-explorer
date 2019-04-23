import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    address?: string;
    onTransactionTotalCount: (transactionTotalCount: number) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTotalPendingTransactionCount extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onTransactionTotalCount, dispatch, address } = this.props;
        apiRequest({
            path: `pending-tx/count${address ? `?address=${address}` : ""}`,
            dispatch,
            showProgressBar: false
        })
            .then((response: any) => {
                onTransactionTotalCount(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestTotalPendingTransactionCount);
