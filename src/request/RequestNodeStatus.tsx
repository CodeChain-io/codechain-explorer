import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

export interface NodeStatusData {
    isCodeChainRunning: boolean;
    isServerRunning: boolean;
}

interface OwnProps {
    onNodeStatus: (status: NodeStatusData) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestNodeStatusInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError } = this.props;
        try {
            this.requestNodeStat();
        } catch (e) {
            onError(e);
        }
    }

    public render() {
        return null;
    }

    private requestNodeStat = async () => {
        const { onNodeStatus, dispatch } = this.props;
        const codechainPing = await apiRequest({
            path: `status/ping/codechain`,
            dispatch,
            showProgressBar: true
        });
        const serverPing = await apiRequest({
            path: `status/ping/server`,
            dispatch,
            showProgressBar: true
        });

        onNodeStatus({
            isCodeChainRunning: codechainPing === "pong",
            isServerRunning: serverPing === "pong"
        });
    };
}

const RequestNodeStatus = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestNodeStatusInternal);

export default RequestNodeStatus;
