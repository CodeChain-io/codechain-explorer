import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { RequestAssetScheme } from "../request";
import { AssetScheme as CoreAssetScheme } from "codechain-sdk/lib/core/classes";

interface Props {
    match: match<{ type: string }>;
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

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { type } } } = this.props;
        const { match: { params: { type: nextType } } } = props;
        if (nextType !== type) {
            this.setState({ ...this.state, assetScheme: undefined });
        }
    }

    public render() {
        const { match: { params: { type } } } = this.props;
        const { notFound, assetScheme } = this.state;
        if (notFound) {
            return <div><Container>Asset not exist for type: {type}</Container></div>
        }
        return (
            <div>
                <Container>
                    {assetScheme
                        ? <div><AssetScheme assetScheme={assetScheme} /></div>
                        : <div><RequestAssetScheme assetType={type} onAssetScheme={this.onAssetScheme} onNotFound={this.onAssetSchemeNotFound} onError={this.onError} /></div>}
                    <hr />
                    <div>{/* FIXME: RequestAssetTransactions */}</div>
                </Container>
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
