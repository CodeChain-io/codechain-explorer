import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import { match } from "react-router";
import { Container, Row, Col } from "reactstrap";

import { RequestAssetTransferAddressUTXO, RequestAssetTransferAddressTransactions } from "../../request";
import { TransactionDoc, AssetBundleDoc } from "../../../db/DocType";

import "./AssetTransferAddress.scss";
import AddressDetails from "../../components/assetTransferAddress/AddressDetails/AddressDetails";
import AssetList from "../../components/asset/AssetList/AssetList";
import TransactionList from "../../components/transaction/TransactionList/TransactionList";
import { ImageLoader } from "../../components/util/ImageLoader/ImageLoader";

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
                <Row className="mb-4">
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
                                    <div className="d-inline-block copy text-center">
                                        <FontAwesome name="copy" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <AddressDetails utxo={utxo} transactions={transactions} />
                {
                    utxo.length > 0 ?
                        <AssetList assetBundles={utxo} fullScreen={false} />
                        : null
                }
                {
                    transactions.length > 0 ?
                        <div>
                            <TransactionList owner={address} fullScreen={false} transactions={transactions} />
                        </div>
                        : null
                }
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
