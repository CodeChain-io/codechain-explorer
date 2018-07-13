import * as React from "react";
import * as _ from "lodash";

import { Asset, AssetScheme } from "codechain-sdk/lib/core/classes";

import { apiRequest, ApiError } from "./ApiRequest";

interface AssetBundle {
    asset: Asset,
    assetScheme: AssetScheme
}

interface OwnProps {
    address: string;
    onAssetBundles: (assetBundles: AssetBundle[]) => void;
    onError: (e: ApiError) => void;
}

class RequestPlatformAddressAssets extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onAssetBundles, onError } = this.props;
        apiRequest({ path: `addr-platform-assets/${address}` }).then((response) => {
            onAssetBundles(_.map(response, (res: AssetBundle) => {
                return {
                    asset: Asset.fromJSON(res.asset),
                    assetScheme: AssetScheme.fromJSON(res.assetScheme)
                }
            }));
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPlatformAddressAssets;
