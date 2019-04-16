import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

export interface FeeStatus {
    pay?: string[];
    transferAsset?: string[];
}

interface OwnProps {
    onData: (data: FeeStatus) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestFeeStats extends React.Component<Props> {
    public componentWillMount() {
        const { onError, dispatch, onData } = this.props;
        apiRequest({
            path: `tx/fee-stats`,
            dispatch,
            showProgressBar: true
        })
            .then((response: FeeStatus) => {
                onData(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestFeeStats);
