import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AssetScheme } from "codechain-sdk/lib/primitives";

import { apiRequest, ApiError } from "./ApiRequest";
import { RootState } from "../../redux/actions";

interface OwnProps {
    txhash: string;
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
        const { cached, dispatch, txhash, onAssetScheme, onNotFound, onError } = this.props;
        if (cached) {
            onAssetScheme(cached);
        }
        apiRequest({ path: `asset/${txhash}` }).then((response: object) => {
            if (response === null) {
                return onNotFound();
            }
            const assetScheme = AssetScheme.fromJSON(response);
            dispatch({
                type: "CACHE_ASSET_SCHEME",
                data: {
                    txhash,
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
        cached: state.assetSchemeByTxhash[props.txhash]
    };
})(RequestAssetSchemeInternal);

export default RequestAssetScheme;
