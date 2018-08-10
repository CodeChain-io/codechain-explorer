import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { AssetBundleDoc } from "../../db/DocType";

interface OwnProps {
    itemsPerPage: number;
    page: number;
    address: string;
    onAssetBundles: (assetBundles: AssetBundleDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPlatformAddressAssetsInternal extends React.Component<Props> {
    public componentWillMount() {
        const { address, onAssetBundles, onError, dispatch, page, itemsPerPage } = this.props;
        apiRequest({ path: `addr-platform-assets/${address}?page=${page}&itemsPerPage=${itemsPerPage}`, dispatch, showProgressBar: true }).then((response: AssetBundleDoc[]) => {
            onAssetBundles(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestPlatformAddressAssets = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestPlatformAddressAssetsInternal);

export default RequestPlatformAddressAssets;
