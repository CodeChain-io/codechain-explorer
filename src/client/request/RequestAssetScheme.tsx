import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { H256 } from "codechain-sdk/lib/core/classes";

import { AssetSchemeDoc } from "codechain-es/lib/types";
import { Type } from "codechain-es/lib/utils";
import { RootState } from "../redux/actions";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    assetType: string;
    onAssetScheme: (assetScheme: AssetSchemeDoc, assetType: string) => void;
    onAssetSchemeNotExist: () => void;
    onError: (e: ApiError) => void;
    progressBarTarget?: string;
}

interface StateProps {
    cached: AssetSchemeDoc;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class RequestAssetSchemeInternal extends React.Component<Props> {
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
        if (cached) {
            setTimeout(() => onAssetScheme(cached, assetType));
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

const RequestAssetScheme = connect((state: RootState, props: OwnProps) => {
    if (Type.isH256String(props.assetType)) {
        return {
            cached: state.appReducer.assetSchemeByAssetType[new H256(props.assetType).value]
        };
    }
    return {
        cached: state.appReducer.assetSchemeByAssetType[props.assetType]
    };
})(RequestAssetSchemeInternal);

export default RequestAssetScheme;
