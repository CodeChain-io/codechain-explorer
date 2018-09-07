import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AssetBundleDoc } from "codechain-es/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

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
        apiRequest({
            path: `search/asset/${assetName}`,
            dispatch,
            showProgressBar: false
        })
            .then((response: AssetBundleDoc[]) => {
                onAssetBundles(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestAssetBundlesByName = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestAssetBundlesByNameInternal);

export default RequestAssetBundlesByName;
