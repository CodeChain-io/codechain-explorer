import * as React from "react";
import { Dispatch, connect } from "react-redux";
import { apiRequest, ApiError } from "./ApiRequest";
import { BlockDoc } from "../../db/DocType";

interface OwnProps {
    address: string;
    onBlocks: (blocks: BlockDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPlatformAddressBlocksInternal extends React.Component<Props> {
    public componentWillMount() {
        const { address, onBlocks, onError, dispatch } = this.props;
        apiRequest({ path: `addr-platform-blocks/${address}`, dispatch }).then((response: BlockDoc[]) => {
            onBlocks(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestPlatformAddressBlocks = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestPlatformAddressBlocksInternal);

export default RequestPlatformAddressBlocks;
