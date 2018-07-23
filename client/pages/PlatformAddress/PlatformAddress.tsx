import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { U256, H160 } from "codechain-sdk/lib/core/classes"
import { RequestPlatformAddressAccount, RequestPlatformAddressParcels, RequestPlatformAddressAssets } from "../../request";
import RequestPlatformAddressBlocks from "../../request/RequestPlatformAddressBlocks";
import AccountDetails from "../../components/platformAddress/AccountDetails/AccountDetails";
import BlockList from "../../components/platformAddress/BlockList/BlockList";
import AssetList from "../../components/platformAddress/AssetList/AssetList";
import ParcelList from "../../components/platformAddress/ParcelList/ParcelList";
import { ParcelDoc, AssetBundleDoc, BlockDoc } from "../../db/DocType";

import "./PlatformAddress.scss"

interface Props {
    match: match<{ address: string }>;
}

interface State {
    account?: {
        nonce: U256,
        balance: U256,
    },
    blocks: BlockDoc[],
    parcels: ParcelDoc[],
    assetBundles: AssetBundleDoc[],
    requested: boolean
}

class Address extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { blocks: [], parcels: [], assetBundles: [], requested: false };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { address } } } = this.props;
        const { match: { params: { address: nextAddress } } } = props;
        if (nextAddress !== address) {
            this.setState({ account: undefined, blocks: [], parcels: [], requested: false });
        }
    }

    public componentDidMount() {
        this.updateRequestState()
    }

    public render() {
        const { match: { params: { address } } } = this.props;
        const { account, blocks, assetBundles, parcels, requested } = this.state;
        if (!requested) {
            return (
                <div>
                    <RequestPlatformAddressBlocks address={address} onBlocks={this.onBlocks} onError={this.onError} />
                    <RequestPlatformAddressParcels address={address} onParcels={this.onParcels} onError={this.onError} />
                    <RequestPlatformAddressAssets address={address} onAssetBundles={this.onAssetBundles} onError={this.onError} />
                </div>
            )
        }
        return (
            <Container className="platform-address">
                <h1>Address Information</h1>
                {
                    account ?
                        <AccountDetails address={address} account={account} />
                        : <RequestPlatformAddressAccount address={address} onAccount={this.onAccount} onError={this.onError} />
                }
                {
                    assetBundles.length > 0 ?
                        <div>
                            <h2 className="sub-title">Issued Assets</h2>
                            <hr />
                            <AssetList assetBundles={assetBundles} />
                        </div>
                        : null
                }
                {
                    parcels.length > 0 ?
                        <div>
                            <h2 className="sub-title">Parcels</h2>
                            <hr />
                            <ParcelList address={new H160(address)} parcels={parcels} />
                        </div>
                        : null
                }
                {
                    blocks.length > 0 ?
                        <div>
                            <h2 className="sub-title">Authored Blocks</h2>
                            <hr />
                            <BlockList blocks={blocks} />
                        </div>
                        : null
                }
            </Container>
        )
    }
    private updateRequestState() {
        this.setState({ requested: true })
    }
    private onParcels = (parcels: ParcelDoc[]) => {
        this.setState({ parcels });
    }
    private onAssetBundles = (assetBundles: AssetBundleDoc[]) => {
        this.setState({ assetBundles });
    }
    private onBlocks = (blocks: BlockDoc[]) => {
        this.setState({ blocks });
    }
    private onAccount = (account: { nonce: U256, balance: U256 }) => {
        this.setState({ account });
    }
    private onError = (e: any) => { console.error(e); }
}

export default Address;
