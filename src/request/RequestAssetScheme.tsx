import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { H160 } from "codechain-sdk/lib/core/classes";

import { AssetSchemeDoc } from "codechain-indexer-types";
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
            path: `asset-scheme/${assetType}`,
            dispatch,
            progressBarTarget,
            showProgressBar: false
        })
            .then((response: AssetSchemeDoc) => {
                if (response === null) {
                    return onAssetSchemeNotExist();
                }
                const assetScheme = response;
                const cacheKey = new H160(assetType).value;
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
    let cachedAssetScheme;
    try {
        const cacheKey = new H160(props.assetType).value;
        cachedAssetScheme = state.appReducer.assetSchemeByAssetType[cacheKey];
    } catch (e) {
        //
    }
    return {
        cached: cachedAssetScheme && {
            data: cachedAssetScheme.data,
            updatedAt: cachedAssetScheme.updatedAt
        }
    };
})(RequestAssetScheme);
