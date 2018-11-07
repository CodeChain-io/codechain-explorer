import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { H256 } from "codechain-sdk/lib/core/classes";

import { AssetSchemeDoc } from "codechain-indexer-types/lib/types";
import { Type } from "codechain-indexer-types/lib/utils";
import { RootState } from "../redux/actions";
import { getCurrentTimestamp } from "../utils/Time";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    assetType: string;
    onAssetScheme: (assetScheme: AssetSchemeDoc, assetType: string) => void;
    onAssetSchemeNotExist: () => void;
    onError: (e: ApiError) => void;
    progressBarTarget?: string;
}

interface StateProps {
    cached: {
        data: AssetSchemeDoc;
        updatedAt: number;
    };
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class RequestAssetScheme extends React.Component<Props> {
    public componentWillMount() {
        const {
            cached,
            dispatch,
            assetType,
            onAssetScheme,
            onAssetSchemeNotExist,
            onError,
            progressBarTarget
        } = this.props;
        if (cached && getCurrentTimestamp() - cached.updatedAt < 10) {
            setTimeout(() => onAssetScheme(cached.data, assetType));
            return;
        }
        apiRequest({
            path: `asset/${assetType}`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: AssetSchemeDoc) => {
                if (response === null) {
                    return onAssetSchemeNotExist();
                }
                const assetScheme = response;
                const cacheKey = new H256(assetType).value;
                dispatch({
                    type: "CACHE_ASSET_SCHEME",
                    data: {
                        assetType: cacheKey,
                        assetScheme
                    }
                });
                onAssetScheme(assetScheme, assetType);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect((state: RootState, props: OwnProps) => {
    let cacheKey = props.assetType;
    if (Type.isH256String(cacheKey)) {
        cacheKey = new H256(cacheKey).value;
    }
    const cachedAssetScheme = state.appReducer.assetSchemeByAssetType[cacheKey];
    return {
        cached: cachedAssetScheme && {
            data: cachedAssetScheme.data,
            updatedAt: cachedAssetScheme.updatedAt
        }
    };
})(RequestAssetScheme);
