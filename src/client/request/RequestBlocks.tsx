import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { BlockDoc } from "../../db/DocType";

interface OwnProps {
    onBlocks: (blocks: BlockDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestBlocksInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onBlocks, dispatch } = this.props;
        apiRequest({ path: `blocks`, dispatch }).then((response: any) => {
            onBlocks(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestBlocks = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestBlocksInternal);

export default RequestBlocks;
