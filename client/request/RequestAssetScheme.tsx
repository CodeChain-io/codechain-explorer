import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AssetScheme } from "codechain-sdk";

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
            dispatch({
                type: "CACHE_ASSET_SCHEME",
                data: {
                    assetType,
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
    return {
        cached: state.assetSchemeByAssetType[props.assetType]
    };
})(RequestAssetSchemeInternal);

export default RequestAssetScheme;
