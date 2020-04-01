import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { AssetSchemeDoc } from "codechain-indexer-types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    assetName: string;
    onSearchResponse: (assetInfo: { assetType: string; assetScheme: AssetSchemeDoc }[]) => void;
    onError: (e: ApiError) => void;
}

type Props = OwnProps & DispatchProp;

class RequestAssetInfosByName extends React.Component<Props> {
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

export default connect()(RequestAssetInfosByName);
