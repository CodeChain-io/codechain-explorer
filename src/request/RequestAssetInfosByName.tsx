import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AssetSchemeDoc } from "codechain-indexer-types/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    assetName: string;
    onSearchResponse: (assetInfo: { assetType: string; assetScheme: AssetSchemeDoc }[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestAssetInfosByNameInternal extends React.Component<Props> {
    public componentWillMount() {
        const { assetName, onSearchResponse, onError, dispatch } = this.props;
        apiRequest({
            path: `search/asset/${assetName}`,
            dispatch,
            showProgressBar: false
        })
            .then((response: { assetType: string; assetScheme: AssetSchemeDoc }[]) => {
                onSearchResponse(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestAssetInfosByName = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestAssetInfosByNameInternal);

export default RequestAssetInfosByName;
