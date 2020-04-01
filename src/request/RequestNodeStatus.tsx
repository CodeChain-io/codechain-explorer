import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    onNodeStatus: (status: boolean) => void;
    onError: (e: ApiError) => void;
}

type Props = OwnProps & DispatchProp;

class RequestNodeStatus extends React.Component<Props> {
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
        const serverPing = await apiRequest({
            path: `ping`,
            dispatch,
            showProgressBar: true
        });

        onNodeStatus(serverPing === "pong");
    };
}

export default connect()(RequestNodeStatus);
