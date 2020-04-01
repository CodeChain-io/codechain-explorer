import * as moment from "moment";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { RootState } from "src/redux/actions";
import { ApiError, apiRequest } from "./ApiRequest";

interface StateProps {
    waitingServerTimeResponse: boolean;
}

type Props = DispatchProp & StateProps;

class RequestServerTime extends React.Component<Props> {
    public componentWillMount() {
        const { dispatch, waitingServerTimeResponse } = this.props;

        if (waitingServerTimeResponse) {
            return;
        }

        dispatch({
            type: "SERVER_TIME_REQUEST_ACTION",
            data: true
        });

        apiRequest({ path: `status/server-time`, dispatch, showProgressBar: false })
            .then((response: any) => {
                dispatch({
                    type: "SERVER_TIME_RESPONSE_ACTION",
                    data: response - moment().unix()
                });
            })
            .catch(error => {
                const e = error as ApiError;
                console.log(e);
            });
    }

    public render() {
        return null;
    }
}

export default connect((state: RootState) => {
    return {
        waitingServerTimeResponse: state.appReducer.waitingServerTimeResponse
    };
})(RequestServerTime);
