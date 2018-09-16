import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { BlockDoc } from "codechain-es/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    page: number;
    itemsPerPage: number;
    lastBlockNumber?: number;
    onBlocks: (blocks: BlockDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestBlocksInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onBlocks, dispatch, page, itemsPerPage, lastBlockNumber } = this.props;
        let path = `blocks?page=${page}&itemsPerPage=${itemsPerPage}`;
        if (lastBlockNumber) {
            path += `&lastBlockNumber=${lastBlockNumber}`;
        }
        apiRequest({
            path,
            dispatch,
            showProgressBar: true
        })
            .then((response: any) => {
                onBlocks(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestBlocks = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestBlocksInternal);

export default RequestBlocks;
