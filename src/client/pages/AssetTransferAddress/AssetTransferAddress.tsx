import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";
import * as QRCode from "qrcode.react"

import { match } from "react-router";
import { Container, Row, Col } from "reactstrap";

import { RequestAssetTransferAddressUTXO, RequestAssetTransferAddressTransactions } from "../../request";
import { TransactionDoc, AssetBundleDoc, Type } from "../../../db/DocType";

import "./AssetTransferAddress.scss";
import AddressDetails from "../../components/assetTransferAddress/AddressDetails/AddressDetails";
import AssetList from "../../components/asset/AssetList/AssetList";
import TransactionList from "../../components/transaction/TransactionList/TransactionList";
import { ImageLoader } from "../../components/util/ImageLoader/ImageLoader";
import CopyButton from "../../components/util/CopyButton/CopyButton";

interface Props {
    match: match<{ address: string }>;
}

interface State {
    utxo: AssetBundleDoc[],
    transactions: TransactionDoc[],
    requested: boolean
}

class AssetTransferAddress extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { utxo: [], transactions: [], requested: false };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { address } } } = this.props;
        const { match: { params: { address: nextAddress } } } = props;
        if (nextAddress !== address) {
            this.setState({ utxo: [], transactions: [], requested: false });
        }
    }

    public render() {
        const { match: { params: { address } } } = this.props;
        const { utxo, transactions, requested } = this.state;
        if (!requested) {
            return (
                <div>
                    <RequestAssetTransferAddressUTXO address={address} onUTXO={this.onUTXO} onError={this.onError} />
                    <RequestAssetTransferAddressTransactions address={address} onTransactions={this.onTransactions} onError={this.onError} />
                </div>
            )
        }
        return (
            <Container className="asset-transfer-address">
                <Row>
                    <Col>
                        <div className="title-container d-flex">
                            <div className="d-inline-block left-container">
                                <ImageLoader size={65} data={address} />
                            </div>
                            <div className="d-inline-block right-container">
                                <h1>Asset Transfer Address</h1>
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
                    <Col lg="9">
                        <AddressDetails utxo={utxo} transactions={transactions} />
                    </Col>
                    <Col lg="3">
                        <div className="right-panel-item mt-3 mt-lg-0">
                            <h2># of Transaction types</h2>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon className="square asset-transfer-transaction-text-color" icon={faSquare} />
                                <span className="mr-auto item-name">Transfer</span>
                                <span>
                                    {_.filter(transactions, (tx) => Type.isAssetTransferTransactionDoc(tx)).length.toLocaleString()
                                    }</span>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon className="square asset-mint-transaction-text-color" icon={faSquare} />
                                <span className="mr-auto item-name">Mint</span>
                                <span>
                                    {_.filter(transactions, (tx) => Type.isAssetMintTransactionDoc(tx)).length.toLocaleString()}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg="9">
                        {
                            utxo.length > 0 ?
                                <div className="mt-large">
                                    <AssetList assetBundles={utxo} totalCount={utxo.length} />
                                </div>
                                : null
                        }
                        {
                            transactions.length > 0 ?
                                <div className="mt-large">
                                    <TransactionList owner={address} transactions={transactions} totalCount={transactions.length} />
                                </div>
                                : null
                        }
                    </Col>
                </Row>
            </Container>
        )
    }

    private onTransactions = (transactions: TransactionDoc[]) => {
        this.setState({ transactions });
    }
    private onUTXO = (utxo: AssetBundleDoc[]) => {
        this.setState({ utxo });
        this.setState({ requested: true });
    }
    private onError = (e: any) => { console.error(e); }
}

export default AssetTransferAddress;
