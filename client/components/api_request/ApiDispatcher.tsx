import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { RootState } from "../../redux/actions";

interface Props {
    api: string;
    requestProps?: any;
    body?: any;
    reducer: (state: RootState, request: any, json: any) => Partial<RootState>
    onSuccess?: (...args: any[]) => void,
    onError?: (e: Error) => void,
}

interface DispatchProps {
    dispatch: Dispatch;
}

class ApiDispatcherInternal extends React.Component<Props & DispatchProps> {
    public componentWillMount() {
        this.request();
    }

    public render() {
        return (null);
    }

    private request() {
        const { dispatch, body, api, reducer, requestProps } = this.props;
        fetch(`http://localhost:8081/api/${api}`, body && {
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        })
        .then(async res => {
            if (res.status === 200) {
                return res.json();
            } else if (res.status === 400) {
                throw new Error(await res.text());
            }
            throw new Error(res.statusText);
        })
        .then(response => {
            dispatch({
                type: "API_DISPATCHER_OK",
                getUpdate: (state: RootState) => reducer(state, requestProps, response)
            });
            this.emitSuccess(response);
        })
        .catch(err => {
            dispatch({
                type: "API_DISPATCHER_ERROR",
                getUpdate: (state: RootState) => state
            });
            this.emitError(err.message);
        });
    }

    private emitSuccess(...args: any[]) {
        const { onSuccess } = this.props;
        try {
            if (onSuccess) {
                onSuccess(...args);
            }
        } catch (e) { console.error(e); }
    }

    private emitError(e: Error) {
        const { onError } = this.props;
        try {
            if (onError) {
                onError(e);
            }
        } catch (e) { console.error(e); }
    }
}

const ApiDispatcher = connect(null,
    (dispatch: Dispatch) => ({ dispatch })
)(ApiDispatcherInternal);

export default ApiDispatcher;
