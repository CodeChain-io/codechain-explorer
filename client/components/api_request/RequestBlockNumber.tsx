import * as React from "react";

import { connect, Dispatch } from "react-redux";
import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    onBlockNumber: (n: number) => void;
    onError: () => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

class RequestBlockNumberInternal extends React.Component<OwnProps & DispatchProps> {
    public componentWillMount() {
        const { dispatch, onBlockNumber, onError } = this.props;
        apiRequest({ path: "blockNumber" }).then((response: string) => {
            const num = Number.parseInt(response)
            dispatch({
                type: "BEST_BLOCK_NUMBER_ACTION",
                data: num
            });
            onBlockNumber(num);
        }).catch((_: ApiError) => {
            onError();
        });
    }

    public render() {
        return (null);
    }
}

const RequestBlockNumber = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestBlockNumberInternal);

export default RequestBlockNumber;
