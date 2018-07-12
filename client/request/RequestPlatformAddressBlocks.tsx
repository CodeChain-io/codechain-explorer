import * as React from "react";

import { Block } from "codechain-sdk/lib/core/classes";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    address: string;
    onBlocks: (blocks: Block[]) => void;
    onError: (e: ApiError) => void;
}

class RequestPlatformAddressBlocks extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onBlocks, onError } = this.props;
        apiRequest({ path: `addr-platform-blocks/${address}` }).then(() => {
            onBlocks([]);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPlatformAddressBlocks;
