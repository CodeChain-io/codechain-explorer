import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    address: string;
    onTotalCount: (totalCount: number) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class ReqeustTotalTransferTransactionCountInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onTotalCount, dispatch, address } = this.props;
        apiRequest({
            path: `addr-asset-txs/${address}/totalCount`,
            dispatch,
            showProgressBar: true
        })
            .then((response: any) => {
                onTotalCount(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const ReqeustTotalTransferTransactionCount = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(ReqeustTotalTransferTransactionCountInternal);

export default ReqeustTotalTransferTransactionCount;
