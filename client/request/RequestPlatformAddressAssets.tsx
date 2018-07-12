import * as React from "react";

import { Asset } from "codechain-sdk/lib/core/classes";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    address: string;
    onAssets: (assets: Asset[]) => void;
    onError: (e: ApiError) => void;
}

class RequestPlatformAddressAssets extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onAssets, onError } = this.props;
        apiRequest({ path: `addr-platform-assets/${address}` }).then(() => {
            onAssets([]);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPlatformAddressAssets;
