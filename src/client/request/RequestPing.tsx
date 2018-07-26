import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    onPong: () => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPingInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onPong, onError } = this.props;
        apiRequest({ path: `ping` }).then((response: string) => {
            if (response === "pong") {
                onPong();
            } else {
                onError({ message: `Expected 'pong' but '${response}'` });
            }
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestPing = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestPingInternal);

export default RequestPing;
