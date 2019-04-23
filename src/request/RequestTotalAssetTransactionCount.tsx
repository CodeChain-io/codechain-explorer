import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    assetType: string;
    onTotalCount: (totalCount: number) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTotalAssetTransactionCount extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onTotalCount, dispatch, assetType } = this.props;
        apiRequest({
            path: `tx/count?assetType=${assetType}`,
            dispatch,
            showProgressBar: false
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

export default connect()(RequestTotalAssetTransactionCount);
