import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AssetScheme, H256 } from "codechain-sdk/lib/core/classes";

import { apiRequest, ApiError } from "./ApiRequest";
import { RootState } from "../redux/actions";

interface OwnProps {
    assetType: string;
    onAssetScheme: (s: AssetScheme) => void;
    onNotFound: () => void;
    onError: (e: ApiError) => void;
}

interface StateProps {
    cached: AssetScheme;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class RequestAssetSchemeInternal extends React.Component<Props> {
    public componentWillMount() {
        const { cached, dispatch, assetType, onAssetScheme, onNotFound, onError } = this.props;
        if (cached) {
            setTimeout(() => onAssetScheme(cached));
            return
        }
        apiRequest({ path: `asset/${assetType}` }).then((response: object) => {
            if (response === null) {
                return onNotFound();
            }
            const assetScheme = AssetScheme.fromJSON(response);
            const cacheKey = new H256(assetType).value;
            dispatch({
                type: "CACHE_ASSET_SCHEME",
                data: {
                    assetType: cacheKey,
                    assetScheme
                }
            });
            onAssetScheme(assetScheme);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestAssetScheme = connect((state: RootState, props: OwnProps) => {
    if (props.assetType.length === 64 || props.assetType.length === 66) {
        return {
            cached: state.assetSchemeByAssetType[new H256(props.assetType).value]
        };
    }
    return {
        cached: state.assetSchemeByAssetType[props.assetType]
    };
})(RequestAssetSchemeInternal);

export default RequestAssetScheme;
