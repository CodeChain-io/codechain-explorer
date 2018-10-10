import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AssetSchemeDoc } from "codechain-es/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    assetType: string;
    onAssetScheme: (assetScheme: AssetSchemeDoc, assetType: string) => void;
    onAssetSchemeNotExist: () => void;
    onError: (e: ApiError) => void;
    progressBarTarget?: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPendingAssetSchemeInternal extends React.Component<Props> {
    public componentWillMount() {
        const { dispatch, assetType, onAssetScheme, onAssetSchemeNotExist, onError, progressBarTarget } = this.props;
        apiRequest({
            path: `asset/pending/${assetType}`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: AssetSchemeDoc) => {
                if (response === null) {
                    return onAssetSchemeNotExist();
                }
                const assetScheme = response;
                onAssetScheme(assetScheme, assetType);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}
const RequestPendingAssetScheme = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestPendingAssetSchemeInternal);

export default RequestPendingAssetScheme;
