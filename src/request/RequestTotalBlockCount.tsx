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

class RequestTotalBlockCount extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onBlockTotalCount, dispatch } = this.props;
        apiRequest({
            path: `block/count`,
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

export default connect()(RequestTotalBlockCount);
