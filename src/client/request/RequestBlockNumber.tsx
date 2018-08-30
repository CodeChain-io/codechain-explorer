import * as React from "react";

import { connect, Dispatch } from "react-redux";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    onBlockNumber: (n: number) => void;
    onError: (e: any) => void;
    repeat?: number;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

interface State {
    // FIXME: | number
    timer?: NodeJS.Timer;
}

class RequestBlockNumberInternal extends React.Component<Props, State> {
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

    public componentWillUnmount() {
        const { timer } = this.state;
        if (timer) {
            clearInterval(timer);
        }
    }

    public render() {
        return null;
    }

    private request() {
        const { dispatch, onBlockNumber, onError } = this.props;
        apiRequest({ path: "blockNumber", showProgressBar: false, dispatch })
            .then((response: string) => {
                const num = Number.parseInt(response);
                dispatch({
                    type: "BEST_BLOCK_NUMBER_ACTION",
                    data: num
                });
                onBlockNumber(num);
            })
            .catch((error: ApiError) => {
                onError(error);
            });
    }
}

const RequestBlockNumber = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestBlockNumberInternal);

export default RequestBlockNumber;
