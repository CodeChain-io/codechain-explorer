import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { U256, Block, AssetScheme, Asset, SignedParcel } from "codechain-sdk/lib/core/classes"
import { RequestPlatformAddressAccount, RequestPlatformAddressParcels, RequestPlatformAddressAssets } from "../request";
import RequestPlatformAddressBlocks from "../request/RequestPlatformAddressBlocks";
import AccountDetails from "../components/platformAddress/AccountDetails/AccountDetails";
import HexString from "../components/util/HexString/HexString";
import BlockList from "../components/block/BlockList/BlockList";
import AssetList from "../components/asset/AssetList/AssetList";
import BlockParcelList from "../components/block/BlockParcelList/BlockParcelList";

interface Props {
    match: match<{ address: string }>;
}

interface AssetBundle {
    asset: Asset,
    assetScheme: AssetScheme
}

interface State {
    account?: {
        nonce: U256,
        balance: U256,
    },
    blocks: Block[],
    parcels: SignedParcel[],
    assetBundles: AssetBundle[]
}

class Address extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { blocks: [], parcels: [], assetBundles: [] };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { address } } } = this.props;
        const { match: { params: { address: nextAddress } } } = props;
        if (nextAddress !== address) {
            this.setState({ account: undefined, blocks: [], parcels: [] });
        }
    }

    public render() {
        const { match: { params: { address } } } = this.props;
        const { account, blocks, assetBundles, parcels } = this.state;
        return (
            <div>
                <Container>
                    <h3>Platform Address</h3>
                    <p><HexString text={address} /></p>
                    {
                        account ?
                            <div>
                                <h4>Account</h4>
                                <AccountDetails account={account} />
                            </div> : <RequestPlatformAddressAccount address={address} onAccount={this.onAccount} onError={this.onError} />
                    }
                    <h4>Balance History</h4>
                    {
                        parcels.length > 0 ? <BlockParcelList parcels={parcels} /> : "Not existed"
                    }
                    <h4>Minting Assets</h4>
                    {
                        assetBundles.length > 0 ? <AssetList assetBundles={assetBundles} /> : "Not existed"
                    }
                    <h4>Mining Blocks</h4>
                    {
                        blocks.length > 0 ? <BlockList blocks={blocks} /> : "Not existed"
                    }
                    <RequestPlatformAddressBlocks address={address} onBlocks={this.onBlocks} onError={this.onError} />
                    <RequestPlatformAddressParcels address={address} onParcels={this.onParcels} onError={this.onError} />
                    <RequestPlatformAddressAssets address={address} onAssetBundles={this.onAssetBundles} onError={this.onError} />
                </Container>
            </div>
        )
    }
    private onParcels = (parcels: SignedParcel[]) => {
        this.setState({ parcels });
    }
    private onAssetBundles = (assetBundles: AssetBundle[]) => {
        this.setState({ assetBundles });
    }
    private onBlocks = (blocks: Block[]) => {
        this.setState({ blocks });
    }
    private onAccount = (account: { nonce: U256, balance: U256 }) => {
        this.setState({ account });
    }
    private onError = (e: any) => { console.error(e); }
}

export default Address;
