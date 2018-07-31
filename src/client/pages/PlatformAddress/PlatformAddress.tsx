import * as React from "react";
import * as FontAwesome from "react-fontawesome"
import { match } from "react-router";
import { Container, Row, Col } from "reactstrap";

import { U256 } from "codechain-sdk/lib/core/classes"
import { RequestPlatformAddressAccount, RequestPlatformAddressParcels, RequestPlatformAddressAssets } from "../../request";
import RequestPlatformAddressBlocks from "../../request/RequestPlatformAddressBlocks";
import AccountDetails from "../../components/platformAddress/AccountDetails/AccountDetails";
import BlockList from "../../components/platformAddress/BlockList/BlockList";
import AssetList from "../../components/platformAddress/AssetList/AssetList";
import ParcelList from "../../components/platformAddress/ParcelList/ParcelList";
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
    requested: boolean,
    blockPage: number,
    parcelPage: number
}

class Address extends React.Component<Props, State> {
    private itemPerPage = 3;
    constructor(props: Props) {
        super(props);
        this.state = { blocks: [], parcels: [], assetBundles: [], requested: false, blockPage: 1, parcelPage: 1 };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { address } } } = this.props;
        const { match: { params: { address: nextAddress } } } = props;
        if (nextAddress !== address) {
            this.setState({ account: undefined, blocks: [], parcels: [], requested: false, blockPage: 1, parcelPage: 1 });
        }
    }

    public render() {
        const { match: { params: { address } } } = this.props;
        const { account, blocks, assetBundles, parcels, requested, blockPage, parcelPage } = this.state;
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
                        <AssetList assetBundles={assetBundles} />
                        : null
                }
                {
                    parcels.length > 0 ?
                        <div>
                            <h2 className="sub-title">Parcels</h2>
                            <hr />
                            <ParcelList address={address} parcels={parcels.slice(0, this.itemPerPage * parcelPage)} />
                            {
                                this.itemPerPage * parcelPage < parcels.length ?
                                    <div className="mt-3">
                                        <div className="load-more-btn mx-auto">
                                            <a href="#" onClick={this.loadMoreParcels}>
                                                <h3>Load Parcels</h3>
                                            </a>
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>
                        : null
                }
                {
                    blocks.length > 0 ?
                        <div>
                            <h2 className="sub-title">Authored Blocks</h2>
                            <hr />
                            <BlockList blocks={blocks.slice(0, this.itemPerPage * blockPage)} />
                            {
                                this.itemPerPage * blockPage < blocks.length ?
                                    <div className="mt-3">
                                        <div className="load-more-btn mx-auto">
                                            <a href="#" onClick={this.loadMoreBlocks}>
                                                <h3>Load Blocks</h3>
                                            </a>
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>
                        : null
                }
            </Container>
        )
    }
    private loadMoreParcels = (e: any) => {
        e.preventDefault();
        this.setState({ parcelPage: this.state.parcelPage + 1 })
    }
    private loadMoreBlocks = (e: any) => {
        e.preventDefault();
        this.setState({ blockPage: this.state.blockPage + 1 })
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
