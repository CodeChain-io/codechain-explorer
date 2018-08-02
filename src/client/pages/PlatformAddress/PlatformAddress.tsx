import * as React from "react";
import * as FontAwesome from "react-fontawesome"
import { match } from "react-router";
import { Container, Row, Col } from "reactstrap";

import { U256 } from "codechain-sdk/lib/core/classes"
import { RequestPlatformAddressAccount, RequestPlatformAddressParcels, RequestPlatformAddressAssets } from "../../request";
import RequestPlatformAddressBlocks from "../../request/RequestPlatformAddressBlocks";
import AccountDetails from "../../components/platformAddress/AccountDetails/AccountDetails";
import BlockList from "../../components/block/BlockList/BlockList";
import AssetList from "../../components/asset/AssetList/AssetList";
import ParcelList from "../../components/parcel/ParcelList/ParcelList";
import { ParcelDoc, AssetBundleDoc, BlockDoc } from "../../../db/DocType";

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

    public render() {
        const { match: { params: { address } } } = this.props;
        const { account, blocks, assetBundles, parcels, requested } = this.state;
        if (!account) {
            return <RequestPlatformAddressAccount address={address} onAccount={this.onAccount} onError={this.onError} onAccountNotExist={this.onAccountNotExist} />;
        }
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
                <Row className="mb-4">
                    <Col>
                        <div className="title-container d-flex">
                            <div className="d-inline-block left-container">
                                <img src="tmp" className="icon" />
                            </div>
                            <div className="d-inline-block right-container">
                                <h1>Platform Address</h1>
                                <div className="hash-container d-flex">
                                    <div className="d-inline-block hash">
                                        <span>{address}</span>
                                    </div>
                                    <div className="d-inline-block copy text-center">
                                        <FontAwesome name="copy" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <AccountDetails account={account} />
                {
                    assetBundles.length > 0 ?
                        <AssetList assetBundles={assetBundles} fullScreen={true} />
                        : null
                }
                {
                    parcels.length > 0 ?
                        <div>
                            <ParcelList address={address} fullScreen={true} parcels={parcels} />
                        </div>
                        : null
                }
                {
                    blocks.length > 0 ?
                        <div>
                            <BlockList blocks={blocks} />
                        </div>
                        : null
                }
            </Container>
        )
    }
    private onParcels = (parcels: ParcelDoc[]) => {
        this.setState({ parcels });
    }
    private onAssetBundles = (assetBundles: AssetBundleDoc[]) => {
        this.setState({ assetBundles });
    }
    private onBlocks = (blocks: BlockDoc[]) => {
        this.setState({ blocks });
        this.setState({ requested: true });
    }
    private onAccountNotExist = () => {
        // TODO
    }
    private onAccount = (account: { nonce: U256, balance: U256 }) => {
        this.setState({ account });
    }
    private onError = (e: any) => { console.error(e); }
}

export default Address;
