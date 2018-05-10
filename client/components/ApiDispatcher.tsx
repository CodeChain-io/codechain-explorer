import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { RootState } from "../redux/actions";

interface Props {
    api: string;
    requestProps?: any;
    reducer: (state: RootState, request: any, json: any) => Partial<RootState>
}

interface ExternalProps {
    dispatch: Dispatch;
}

class ApiDispatcherInternal extends React.Component<Props & ExternalProps> {
    public componentDidMount() {
        const { dispatch, api, reducer, requestProps } = this.props;
        fetch(`http://localhost:8081/api/${api}`)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then(response => {
                dispatch({
                    type: "API_DISPATCHER_OK",
                    getUpdate: (state: RootState) => reducer(state, requestProps, response)
                });
            })
            .catch(err => {
                dispatch({
                    type: "API_DISPATCHER_ERROR",
                    getUpdate: (state: RootState) => state
                });
            });
    }

    public render() {
        return <div/>;
    }
}

const ApiDispatcher = connect(
    (state: RootState) => {
        return {};
    },
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(ApiDispatcherInternal);

export default ApiDispatcher;
