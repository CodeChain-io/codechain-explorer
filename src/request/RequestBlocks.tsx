import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { BlockDoc } from "codechain-indexer-types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    page: number;
    itemsPerPage: number;
    showProgressBar: boolean;
    onBlocks: (blocks: BlockDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestBlocks extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onBlocks, dispatch, page, itemsPerPage, showProgressBar } = this.props;
        const path = `block?page=${page}&itemsPerPage=${itemsPerPage}`;
        apiRequest({
            path,
            dispatch,
            showProgressBar
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

export default connect()(RequestBlocks);
