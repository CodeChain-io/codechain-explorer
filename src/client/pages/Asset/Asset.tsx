import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import { match } from "react-router";
import { Container, Row, Col } from "reactstrap";

import { RequestAssetScheme } from "../../request";
import AssetDetails from "../../components/asset/AssetDetails/AssetDetails";
import RequestAssetTransactions from "../../request/RequestAssetTransactions";
import TransactionList from "../../components/transaction/TransactionList/TransactionList";
import { TransactionDoc, AssetSchemeDoc, Type } from "../../../db/DocType";

import "./Asset.scss"
import { H256 } from "codechain-sdk/lib/core/H256";
import HexString from "../../components/util/HexString/HexString";

interface Props {
    match: match<{ assetType: string }>;
}

interface State {
    transactions: TransactionDoc[];
    assetScheme?: AssetSchemeDoc;
    notFound: boolean;
}

class Asset extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { notFound: false, transactions: [] };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { assetType } } } = this.props;
        const { match: { params: { assetType: nextType } } } = props;
        if (nextType !== assetType) {
            this.setState({ ...this.state, assetScheme: undefined, transactions: [] });
        }
    }

    public render() {
        const { match: { params: { assetType } } } = this.props;
        const { notFound, assetScheme, transactions } = this.state;

        if (!assetScheme) {
            return <RequestAssetScheme assetType={assetType} onAssetScheme={this.onAssetScheme} onAssetSchemeNotExist={this.onAssetSchemeNotFound} onError={this.onError} />;
        }
        if (notFound) {
            return <div>{assetType} not found.</div>
        }
        return (
            <Container className="asset">
                <Row className="mb-4">
                    <Col>
                        <div className="title-container d-flex">
                            <div className="d-inline-block left-container">
                                <img src={Type.getMetadata(assetScheme.metadata).icon_url} className="icon" />
                            </div>
                            <div className="d-inline-block right-container">
                                <h1>Asset</h1>
                                <div className="hash-container d-flex">
                                    <div className="d-inline-block hash">
                                        <HexString text={assetType} />
                                    </div>
                                    <div className="d-inline-block copy text-center">
                                        <FontAwesome name="copy" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <AssetDetails assetType={assetType} assetScheme={assetScheme} />
                {
                    transactions.length !== 0 ?
                        <div className="mt-4">
                            <TransactionList assetType={new H256(assetType)} fullScreen={true} transactions={transactions} />
                        </div>
                        : <RequestAssetTransactions assetType={assetType} onTransactions={this.onTransactionList} onError={this.onError} />
                }
            </Container>
        )
    }

    private onAssetScheme = (assetScheme: AssetSchemeDoc) => {
        this.setState({ assetScheme });
    }

    private onTransactionList = (transactions: TransactionDoc[]) => {
        this.setState({ transactions })
    }

    private onAssetSchemeNotFound = () => console.error("AssetScheme not found");

    private onError = (e: any) => console.error(e);
}

export default Asset;
