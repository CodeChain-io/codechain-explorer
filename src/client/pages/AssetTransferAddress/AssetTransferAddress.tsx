import * as React from "react";
import * as QRCode from "qrcode.react"

import { match } from "react-router";
import { Container, Row, Col } from "reactstrap";

import { RequestAssetTransferAddressUTXO, RequestAssetTransferAddressTransactions } from "../../request";
import { TransactionDoc, AssetBundleDoc } from "../../../db/DocType";

import "./AssetTransferAddress.scss";
import AddressDetails from "../../components/assetTransferAddress/AddressDetails/AddressDetails";
import AssetList from "../../components/asset/AssetList/AssetList";
import TransactionList from "../../components/transaction/TransactionList/TransactionList";
import { ImageLoader } from "../../components/util/ImageLoader/ImageLoader";
import CopyButton from "../../components/util/CopyButton/CopyButton";
import ReqeustTotalTransferTransactionCount from "../../request/RequestTotalTransferTransactionCount";

interface Props {
    match: match<{ address: string }>;
}

interface State {
    utxo: AssetBundleDoc[],
    transactions: TransactionDoc[],
    pageForTransactions: number;
    loadUTXO: boolean;
    loadTransaction: boolean;
    totalTransactionCount: number;
    noMoreUTXO: boolean;
    noMoreTransaction: boolean;
}

class AssetTransferAddress extends React.Component<Props, State> {
    private utxoItemsPerPage = 12;
    private transactionItemsPerPage = 3;
    constructor(props: Props) {
        super(props);
        this.state = { utxo: [], transactions: [], pageForTransactions: 1, totalTransactionCount: 0, loadUTXO: true, loadTransaction: true, noMoreUTXO: false, noMoreTransaction: false };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { address } } } = this.props;
        const { match: { params: { address: nextAddress } } } = props;
        if (nextAddress !== address) {
            this.setState({ utxo: [], transactions: [], pageForTransactions: 1, totalTransactionCount: 0, loadUTXO: true, loadTransaction: true, noMoreUTXO: false, noMoreTransaction: false });
        }
    }

    public render() {
        const { match: { params: { address } } } = this.props;
        const { utxo, transactions, pageForTransactions, loadTransaction, loadUTXO, totalTransactionCount, noMoreTransaction, noMoreUTXO } = this.state;
        return (
            <Container className="asset-transfer-address">
                <Row>
                    <Col>
                        <div className="title-container d-flex">
                            <div className="d-inline-block left-container">
                                <ImageLoader size={65} data={address} />
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
                        {
                            loadUTXO ?
                                <RequestAssetTransferAddressUTXO address={address} lastTransactionHash={utxo.length > 0 ? utxo[utxo.length - 1].asset.transactionHash : undefined} itemsPerPage={this.utxoItemsPerPage} onUTXO={this.onUTXO} onError={this.onError} />
                                : null
                        }
                        {
                            utxo.length > 0 ?
                                <div className="mt-large">
                                    <AssetList assetBundles={utxo} loadMoreAction={this.loadMoreUTXO} hideMoreButton={noMoreUTXO} />
                                </div>
                                : null
                        }
                        {
                            <ReqeustTotalTransferTransactionCount address={address} onTotalCount={this.onTransactionTotalCount} onError={this.onError} />
                        }
                        {
                            loadTransaction ?
                                <RequestAssetTransferAddressTransactions address={address} page={pageForTransactions} itemsPerPage={this.transactionItemsPerPage} onTransactions={this.onTransactions} onError={this.onError} />
                                : null
                        }
                        {
                            transactions.length > 0 ?
                                <div className="mt-large">
                                    <TransactionList owner={address} transactions={transactions} totalCount={totalTransactionCount} loadMoreAction={this.loadMoreTransaction} hideMoreButton={noMoreTransaction} />
                                </div>
                                : null
                        }
                    </Col>
                </Row>
            </Container>
        )
    }

    private loadMoreTransaction = () => {
        this.setState({ loadTransaction: true, pageForTransactions: this.state.pageForTransactions + 1 });
    }

    private loadMoreUTXO = () => {
        this.setState({ loadUTXO: true });
    }

    private onTransactions = (transactions: TransactionDoc[]) => {
        if (transactions.length < this.transactionItemsPerPage) {
            this.setState({ noMoreTransaction: true });
        }
        this.setState({ transactions: this.state.transactions.concat(transactions), loadTransaction: false });
    }

    private onTransactionTotalCount = (totalCount: number) => {
        this.setState({ totalTransactionCount: totalCount });
    }

    private onUTXO = (utxo: AssetBundleDoc[]) => {
        if (utxo.length < this.utxoItemsPerPage) {
            this.setState({ noMoreUTXO: true });
        }
        this.setState({ utxo: this.state.utxo.concat(utxo), loadUTXO: false });
    }

    private onError = (e: any) => {
        console.log(e);
        this.setState({ loadTransaction: false, loadUTXO: false });
    }
}

export default AssetTransferAddress;
