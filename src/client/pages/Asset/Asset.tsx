import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import { match } from "react-router";
import { Container, Row, Col } from "reactstrap";

import { RequestAssetScheme } from "../../request";
import AssetDetails from "../../components/asset/AssetDetails/AssetDetails";
import RequestAssetTransactions from "../../request/RequestAssetTransactions";
import AssetTransactionList from "../../components/asset/AssetTransactionList/AssetTransactionList";
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
    page: number;
}

class Asset extends React.Component<Props, State> {
    private itemPerPage = 3;
    constructor(props: Props) {
        super(props);
        this.state = { notFound: false, transactions: [], page: 1 };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { assetType } } } = this.props;
        const { match: { params: { assetType: nextType } } } = props;
        if (nextType !== assetType) {
            this.setState({ ...this.state, assetScheme: undefined, transactions: [], page: 1 });
        }
    }

    public render() {
        const { match: { params: { assetType } } } = this.props;
        const { notFound, assetScheme, transactions, page } = this.state;

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
                        <div>
                            <AssetTransactionList assetType={new H256(assetType)} transactions={transactions.slice(0, this.itemPerPage * page)} />
                            {
                                this.itemPerPage * page < transactions.length ?
                                    <div className="mt-3">
                                        <div className="load-more-btn mx-auto">
                                            <a href="#" onClick={this.loadMore}>
                                                <h3>Load Transactions</h3>
                                            </a>
                                        </div>
                                    </div>
                                    : null
                            }
                        </div>
                        : <RequestAssetTransactions assetType={assetType} onTransactions={this.onTransactionList} onError={this.onError} />
                }
            </Container>
        )
    }
    private loadMore = (e: any) => {
        e.preventDefault();
        this.setState({ page: this.state.page + 1 })
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
