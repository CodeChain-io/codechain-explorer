import * as QRCode from "qrcode.react";
import * as React from "react";
import { match } from "react-router";
import { Col, Container, Row } from "reactstrap";
import { Error } from "../../components/error/Error/Error";

import { BlockDoc, ParcelDoc } from "codechain-indexer-types/lib/types";
import { U256 } from "codechain-sdk/lib/core/classes";
import BlockList from "../../components/block/BlockList/BlockList";
import ParcelList from "../../components/parcel/ParcelList/ParcelList";
import AccountDetails from "../../components/platformAddress/AccountDetails/AccountDetails";
import {
    RequestPlatformAddressAccount,
    RequestPlatformAddressParcels,
    RequestTotalPlatformBlockCount,
    RequestTotalPlatformParcelCount
} from "../../request";
import RequestPlatformAddressBlocks from "../../request/RequestPlatformAddressBlocks";

import CopyButton from "../../components/util/CopyButton/CopyButton";
import { ImageLoader } from "../../components/util/ImageLoader/ImageLoader";
import "./PlatformAddress.scss";

interface Props {
    match: match<{ address: string }>;
}

interface State {
    account?: {
        seq: U256;
        balance: U256;
    };
    blocks: BlockDoc[];
    parcels: ParcelDoc[];
    loadBlock: boolean;
    loadParcel: boolean;
    pageForBlock: number;
    pageForParcel: number;
    noMoreBlock: boolean;
    noMoreParcel: boolean;
    notFound: boolean;
    totalBlockCount: number;
    totalParcelCount: number;
}

class Address extends React.Component<Props, State> {
    private blockItemsPerPage = 6;
    private parcelItemsPerPage = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            blocks: [],
            parcels: [],
            notFound: false,
            loadBlock: true,
            loadParcel: true,
            pageForBlock: 1,
            pageForParcel: 1,
            noMoreBlock: false,
            noMoreParcel: false,
            totalBlockCount: 0,
            totalParcelCount: 0
        };
    }

    public componentWillReceiveProps(props: Props) {
        const {
            match: {
                params: { address }
            }
        } = this.props;
        const {
            match: {
                params: { address: nextAddress }
            }
        } = props;
        if (nextAddress !== address) {
            this.setState({
                account: undefined,
                blocks: [],
                parcels: [],
                notFound: false,
                loadBlock: true,
                loadParcel: true,
                pageForBlock: 1,
                pageForParcel: 1,
                noMoreBlock: false,
                noMoreParcel: false,
                totalBlockCount: 0,
                totalParcelCount: 0
            });
        }
    }

    public render() {
        const {
            match: {
                params: { address }
            }
        } = this.props;
        const {
            account,
            blocks,
            parcels,
            notFound,
            loadBlock,
            loadParcel,
            pageForBlock,
            pageForParcel,
            noMoreBlock,
            noMoreParcel,
            totalBlockCount,
            totalParcelCount
        } = this.state;
        if (notFound) {
            return (
                <div>
                    <Error content={address} title="The address does not exist." />
                </div>
            );
        }
        if (!account) {
            return (
                <RequestPlatformAddressAccount
                    address={address}
                    onAccount={this.onAccount}
                    onError={this.onError}
                    onAccountNotExist={this.onAccountNotExist}
                />
            );
        }
        return (
            <Container className="platform-address animated fadeIn">
                <Row>
                    <Col>
                        <div className="title-container d-flex">
                            <div className="d-inline-block left-container">
                                <ImageLoader size={65} data={address} isAssetImage={false} />
                            </div>
                            <div className="d-inline-block right-container">
                                <h1>Platform Address</h1>
                                <div className="hash-container d-flex">
                                    <div className="d-inline-block hash">
                                        <span>{address}</span>
                                    </div>
                                    <CopyButton className="d-inline-block" copyString={address} />
                                </div>
                            </div>
                            <div className="d-inline-block qrcode-container">
                                <QRCode size={65} value={address} />
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="big-size-qr text-center">
                    <QRCode size={120} value={address} />
                </div>
                <div className="mt-large">
                    <AccountDetails account={account} />
                </div>
                {
                    <RequestTotalPlatformParcelCount
                        address={address}
                        onTotalCount={this.onTotalParcelCount}
                        onError={this.onError}
                    />
                }
                {loadParcel ? (
                    <RequestPlatformAddressParcels
                        page={pageForParcel}
                        itemsPerPage={this.parcelItemsPerPage}
                        address={address}
                        onParcels={this.onParcels}
                        onError={this.onError}
                    />
                ) : null}
                {parcels.length > 0 ? (
                    <div className="mt-large">
                        <ParcelList
                            address={address}
                            hideTitle={true}
                            parcels={parcels}
                            totalCount={totalParcelCount}
                            loadMoreAction={this.loadMoreParcel}
                            hideMoreButton={noMoreParcel}
                        />
                    </div>
                ) : null}
                {
                    <RequestTotalPlatformBlockCount
                        address={address}
                        onTotalCount={this.onTotalBlockCount}
                        onError={this.onError}
                    />
                }
                {loadBlock ? (
                    <RequestPlatformAddressBlocks
                        page={pageForBlock}
                        itemsPerPage={this.blockItemsPerPage}
                        address={address}
                        onBlocks={this.onBlocks}
                        onError={this.onError}
                    />
                ) : null}
                {blocks.length > 0 ? (
                    <div className="mt-large">
                        <BlockList
                            blocks={blocks}
                            totalCount={totalBlockCount}
                            loadMoreAction={this.loadMoreBlock}
                            hideMoreButton={noMoreBlock}
                        />
                    </div>
                ) : null}
            </Container>
        );
    }
    private onParcels = (parcels: ParcelDoc[]) => {
        if (parcels.length < this.parcelItemsPerPage) {
            this.setState({ noMoreParcel: true });
        }
        this.setState({
            parcels: this.state.parcels.concat(parcels),
            loadParcel: false
        });
    };
    private onBlocks = (blocks: BlockDoc[]) => {
        if (blocks.length < this.blockItemsPerPage) {
            this.setState({ noMoreBlock: true });
        }
        this.setState({
            blocks: this.state.blocks.concat(blocks),
            loadBlock: false
        });
    };
    private loadMoreParcel = () => {
        this.setState({
            loadParcel: true,
            pageForParcel: this.state.pageForParcel + 1
        });
    };
    private loadMoreBlock = () => {
        this.setState({
            loadBlock: true,
            pageForBlock: this.state.pageForBlock + 1
        });
    };
    private onTotalParcelCount = (totalCount: number) => {
        this.setState({ totalParcelCount: totalCount });
    };
    private onTotalBlockCount = (totalCount: number) => {
        this.setState({ totalBlockCount: totalCount });
    };
    private onAccountNotExist = () => {
        this.setState({ notFound: true });
    };
    private onAccount = (account: { seq: U256; balance: U256 }) => {
        this.setState({ account });
    };
    private onError = (e: any) => {
        console.error(e);
    };
}

export default Address;
