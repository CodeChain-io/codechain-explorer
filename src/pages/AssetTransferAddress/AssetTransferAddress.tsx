import * as QRCode from "qrcode.react";
import * as React from "react";

import { match } from "react-router";
import { Col, Container, Row } from "reactstrap";

import { AggsUTXO, TransactionDoc } from "codechain-indexer-types/lib/types";
import { RequestAssetTransferAddressTransactions, RequestAssetTransferAddressUTXO } from "../../request";

import AssetList from "../../components/asset/AssetList/AssetList";
import AddressDetails from "../../components/assetTransferAddress/AddressDetails/AddressDetails";
import TransactionList from "../../components/transaction/TransactionList/TransactionList";
import CopyButton from "../../components/util/CopyButton/CopyButton";
import { ImageLoader } from "../../components/util/ImageLoader/ImageLoader";
import ReqeustTotalTransferTransactionCount from "../../request/RequestTotalTransferTransactionCount";
import "./AssetTransferAddress.scss";

interface Props {
    match: match<{ address: string }>;
}

interface State {
    aggsUTXO: AggsUTXO[];
    transactions: TransactionDoc[];
    pageForTransactions: number;
    pageForAssets: number;
    loadUTXO: boolean;
    loadTransaction: boolean;
    totalTransactionCount: number;
    noMoreUTXO: boolean;
    noMoreTransaction: boolean;
}

class AssetTransferAddress extends React.Component<Props, State> {
    private utxoItemsPerPage = 12;
    private transactionItemsPerPage = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            aggsUTXO: [],
            transactions: [],
            pageForTransactions: 1,
            pageForAssets: 1,
            totalTransactionCount: 0,
            loadUTXO: true,
            loadTransaction: true,
            noMoreUTXO: false,
            noMoreTransaction: false
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
                aggsUTXO: [],
                transactions: [],
                pageForTransactions: 1,
                pageForAssets: 1,
                totalTransactionCount: 0,
                loadUTXO: true,
                loadTransaction: true,
                noMoreUTXO: false,
                noMoreTransaction: false
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
            aggsUTXO,
            transactions,
            pageForTransactions,
            pageForAssets,
            loadTransaction,
            loadUTXO,
            totalTransactionCount,
            noMoreTransaction,
            noMoreUTXO
        } = this.state;
        return (
            <Container className="asset-transfer-address">
                <Row>
                    <Col>
                        <div className="title-container d-flex">
                            <div className="d-inline-block left-container">
                                <ImageLoader size={65} data={address} isAssetImage={false} />
                            </div>
                            <div className="d-inline-block right-container">
                                <h1>Asset Address</h1>
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
                <Row className="big-size-qr text-center">
                    <Col>
                        <QRCode size={120} value={address} />
                    </Col>
                </Row>
                <Row className="mt-large">
                    <Col>
                        <AddressDetails totalTransactionCount={totalTransactionCount} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {loadUTXO ? (
                            <RequestAssetTransferAddressUTXO
                                address={address}
                                page={pageForAssets}
                                itemsPerPage={this.utxoItemsPerPage}
                                onAggsUTXO={this.onAggsUTXO}
                                onError={this.onError}
                            />
                        ) : null}
                        {aggsUTXO.length > 0 ? (
                            <div className="mt-large">
                                <AssetList
                                    aggsUTXO={aggsUTXO}
                                    loadMoreAction={this.loadMoreUTXO}
                                    hideMoreButton={noMoreUTXO}
                                />
                            </div>
                        ) : null}
                        {
                            <ReqeustTotalTransferTransactionCount
                                address={address}
                                onTotalCount={this.onTransactionTotalCount}
                                onError={this.onError}
                            />
                        }
                        {loadTransaction ? (
                            <RequestAssetTransferAddressTransactions
                                address={address}
                                page={pageForTransactions}
                                itemsPerPage={this.transactionItemsPerPage}
                                onTransactions={this.onTransactions}
                                onError={this.onError}
                            />
                        ) : null}
                        {totalTransactionCount > 0 ? (
                            <div className="mt-large">
                                <TransactionList
                                    owner={address}
                                    hideTitle={true}
                                    transactions={transactions}
                                    totalCount={totalTransactionCount}
                                    loadMoreAction={this.loadMoreTransaction}
                                    hideMoreButton={noMoreTransaction}
                                />
                            </div>
                        ) : null}
                    </Col>
                </Row>
            </Container>
        );
    }

    private loadMoreTransaction = () => {
        this.setState({
            loadTransaction: true,
            pageForTransactions: this.state.pageForTransactions + 1
        });
    };

    private loadMoreUTXO = () => {
        this.setState({ loadUTXO: true, pageForAssets: this.state.pageForAssets + 1 });
    };

    private onTransactions = (transactions: TransactionDoc[]) => {
        this.setState({
            transactions: this.state.transactions.concat(transactions),
            loadTransaction: false
        });
        if (this.state.transactions.length >= this.state.totalTransactionCount) {
            this.setState({ noMoreTransaction: true });
        }
    };

    private onTransactionTotalCount = (totalCount: number) => {
        this.setState({ totalTransactionCount: totalCount });
    };

    private onAggsUTXO = (aggsUTXO: AggsUTXO[]) => {
        if (aggsUTXO.length < this.utxoItemsPerPage) {
            this.setState({ noMoreUTXO: true });
        }
        this.setState({ aggsUTXO: this.state.aggsUTXO.concat(aggsUTXO), loadUTXO: false });
    };

    private onError = (e: any) => {
        console.log(e);
        this.setState({ loadTransaction: false, loadUTXO: false });
    };
}

export default AssetTransferAddress;
