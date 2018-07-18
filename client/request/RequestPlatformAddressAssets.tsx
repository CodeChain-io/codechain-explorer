import * as React from "react";

import { apiRequest, ApiError } from "./ApiRequest";
import { AssetBundleDoc } from "../db/DocType";

interface OwnProps {
    address: string;
    onAssetBundles: (assetBundles: AssetBundleDoc[]) => void;
    onError: (e: ApiError) => void;
}

class RequestPlatformAddressAssets extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onAssetBundles, onError } = this.props;
        apiRequest({ path: `addr-platform-assets/${address}` }).then((response: AssetBundleDoc[]) => {
            onAssetBundles(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPlatformAddressAssets;
