import * as React from "react";

import { RequestAssetScheme } from "../components/api_request";
import { AssetScheme as CoreAssetScheme } from "codechain-sdk/lib/primitives";

interface Props {
    match: any;
}

interface State {
    assetScheme?: CoreAssetScheme;
    notFound: boolean;
}

interface AssetSchemeProps {
    assetScheme: CoreAssetScheme;
}

const AssetScheme = (props: AssetSchemeProps) => {
    const { metadata, amount, registrar } = props.assetScheme;
    return <div>
        <div>metadata: {JSON.stringify(metadata)}</div>
        <div>amount: {amount}</div>
        <div>registrar: {registrar ? registrar : "None"}</div>
    </div>
};

class Asset extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { notFound: false };
    }
    public render() {
        const { match } = this.props;
        const { type } = match.params;
        const { notFound, assetScheme } = this.state;
        if (notFound) {
            return <div>Asset not exist for txhash: {type}</div>
        }
        return (
            <div>
                {assetScheme
                    ? <div><AssetScheme assetScheme={assetScheme} /></div>
                    : <div><RequestAssetScheme txhash={type} onAssetScheme={this.onAssetScheme} onNotFound={this.onAssetSchemeNotFound} onError={this.onError}/></div>}
                <hr />
                <div>{/* FIXME: RequestAssetTransactions */}</div>
            </div>
        )
    }

    private onAssetScheme = (assetScheme: CoreAssetScheme) => {
        this.setState({ assetScheme });
    }

    private onAssetSchemeNotFound = () => console.error("AssetScheme not found");

    private onError = (e: any) => console.error(e);
}

export default Asset;
