import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

export interface CodeChainData {
    networkId: string;
}

interface OwnProps {
    onCodeChain: (codechain: CodeChainData) => void;
    onError: (e: ApiError) => void;
}

type Props = OwnProps & DispatchProp;

class RequestCodeChainStatus extends React.Component<Props> {
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

export default connect()(RequestCodeChainStatus);
