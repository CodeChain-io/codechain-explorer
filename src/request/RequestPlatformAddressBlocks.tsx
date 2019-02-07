import { BlockDoc } from "codechain-indexer-types";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    itemsPerPage: number;
    page: number;
    address: string;
    onBlocks: (blocks: BlockDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPlatformAddressBlocks extends React.Component<Props> {
    public componentWillMount() {
        const { address, onBlocks, onError, dispatch, page, itemsPerPage } = this.props;
        apiRequest({
            path: `addr-platform-blocks/${address}?page=${page}&itemsPerPage=${itemsPerPage}`,
            dispatch,
            showProgressBar: true
        })
            .then((response: BlockDoc[]) => {
                onBlocks(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestPlatformAddressBlocks);
