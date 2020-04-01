import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    onBlockTotalCount: (blockTotalCount: number) => void;
    onError: (e: ApiError) => void;
}

type Props = OwnProps & DispatchProp;

class RequestTotalBlockCount extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onBlockTotalCount, dispatch } = this.props;
        apiRequest({
            path: `block/count`,
            dispatch,
            showProgressBar: false
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
