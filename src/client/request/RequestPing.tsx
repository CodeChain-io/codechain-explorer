import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    onPong: () => void;
    onError: (e: ApiError) => void;
    onDead: () => void;
    repeat?: number;
}

interface DispatchProps {
    dispatch: Dispatch;
}

interface State {
    // FIXME: | number
    timer?: NodeJS.Timer;
}

type Props = OwnProps & DispatchProps;

class RequestPingInternal extends React.Component<Props, State> {
    public componentWillMount() {
        this.setState({});
        const { repeat } = this.props;
        if (repeat) {
            const timer = setInterval(() => this.request(), repeat);
            this.setState({ timer });
        }
        this.request();
    }

    public componentWillReceiveProps(props: Props) {
        if (props.repeat === this.props.repeat) {
            return;
        }
        const { timer } = this.state;
        if (timer) {
            clearInterval(timer);
        }
        if (props.repeat) {
            const newTimer = setInterval(() => this.request(), props.repeat);
            this.setState({ timer: newTimer });
        } else {
            this.setState({ timer: undefined });
        }
    }

    public render() {
        return null;
    }

    public componentWillUnmount() {
        const { timer } = this.state;
        if (timer) {
            clearInterval(timer);
        }
    }

    private request = () => {
        const { onPong, onError, dispatch, onDead } = this.props;
        apiRequest({ path: `ping`, showProgressBar: false, dispatch })
            .then((response: string) => {
                if (response === "pong") {
                    onPong();
                } else {
                    onError({ message: `Expected "pong" but "${response}"` });
                }
            })
            .catch(onDead);
    };
}

const RequestPing = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestPingInternal);

export default RequestPing;
