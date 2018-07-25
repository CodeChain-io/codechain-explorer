import * as React from "react";
import { apiRequest, ApiError } from "./ApiRequest";
import { BlockDoc } from "../../db/DocType";

interface OwnProps {
    address: string;
    onBlocks: (blocks: BlockDoc[]) => void;
    onError: (e: ApiError) => void;
}

class RequestPlatformAddressBlocks extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onBlocks, onError } = this.props;
        apiRequest({ path: `addr-platform-blocks/${address}` }).then((response: BlockDoc[]) => {
            onBlocks(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPlatformAddressBlocks;
