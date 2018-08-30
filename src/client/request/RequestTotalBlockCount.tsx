import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    onBlockTotalCount: (blockTotalCount: number) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTotalBlockCountInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onBlockTotalCount, dispatch } = this.props;
        apiRequest({
            path: `blocks/totalCount`,
            dispatch,
            showProgressBar: true
        })
            .then((response: any) => {
                onBlockTotalCount(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestTotalBlockCount = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestTotalBlockCountInternal);

export default RequestTotalBlockCount;
