import * as React from "react";
import * as _ from "lodash";

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
        apiRequest({ path: `addr-platform-blocks/${address}` }).then((response) => {
            onBlocks(_.map(response, res => Block.fromJSON(res)));
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPlatformAddressBlocks;
