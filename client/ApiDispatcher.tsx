import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { RootState } from "./redux/actions";

interface Props {
    api: string;
    reducer: (state: RootState, json: any) => Partial<RootState>
}

interface ExternalProps {
    dispatch: Dispatch;
}

class ApiDispatcherInternal extends React.Component<Props & ExternalProps> {
    public componentDidMount() {
        const { dispatch, api, reducer } = this.props;
        fetch(`http://localhost:8081/api/${api}`)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then(json => {
                dispatch({
                    type: "API_DISPATCHER_OK",
                    getUpdate: (state: RootState) => reducer(state, json)
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
