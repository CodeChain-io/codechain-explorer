import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

export interface CodeChainData {
    nodeVersion: string;
    commitHash: string;
    networkId: string;
    peerCount: number;
    peers: string[];
    whiteList: {
        enabled: boolean;
        list: string[];
    };
    blackList: {
        enabled: boolean;
        list: string[];
    };
}

interface OwnProps {
    onCodeChain: (codechain: CodeChainData) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestCodeChainStatusInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, dispatch, onCodeChain } = this.props;
        apiRequest({
            path: `status/codechain`,
            dispatch,
            showProgressBar: true
        })
            .then((response: any) => {
                onCodeChain(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestCodeChainStatus = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestCodeChainStatusInternal);

export default RequestCodeChainStatus;
