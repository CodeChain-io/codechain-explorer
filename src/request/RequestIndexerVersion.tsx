import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    onVersion: (version: string) => void;
    onError: (e: ApiError) => void;
    progressBarTarget?: string;
}

type Props = OwnProps & DispatchProp;

class RequestIndexerVersion extends React.Component<Props> {
    public componentWillMount() {
        const { dispatch, progressBarTarget } = this.props;
        apiRequest({
            path: `/version`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: unknown) => {
                this.props.onVersion(response as string);
            })
            .catch(this.props.onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestIndexerVersion);
