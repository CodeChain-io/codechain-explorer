import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    assetType: string;
    onTotalCount: (totalCount: number) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTotalAssetTransactionCountInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onTotalCount, dispatch, assetType } = this.props;
        apiRequest({ path: `asset-txs/${assetType}/totalCount`, dispatch, showProgressBar: true }).then((response: any) => {
            onTotalCount(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestTotalAssetTransactionCount = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestTotalAssetTransactionCountInternal);

export default RequestTotalAssetTransactionCount;
