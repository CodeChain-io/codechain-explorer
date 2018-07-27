import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { AssetBundleDoc } from "../../db/DocType";

interface OwnProps {
    assetName: string;
    onAssetBundles: (assetBundles: AssetBundleDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestAssetBundlesByNameInternal extends React.Component<Props> {
    public componentWillMount() {
        const { assetName, onAssetBundles, onError, dispatch } = this.props;
        apiRequest({ path: `search/asset/${assetName}`, dispatch, showProgressBar: false }).then((response: AssetBundleDoc[]) => {
            onAssetBundles(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestAssetBundlesByName = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestAssetBundlesByNameInternal);

export default RequestAssetBundlesByName;
