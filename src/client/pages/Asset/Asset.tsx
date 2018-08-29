import * as React from "react";
import { match } from "react-router";
import { Container, Row, Col } from "reactstrap";
import { Error } from "../../components/error/Error/Error";

import { RequestAssetScheme, RequestTotalAssetTransactionCount } from "../../request";
import AssetDetails from "../../components/asset/AssetDetails/AssetDetails";
import RequestAssetTransactions from "../../request/RequestAssetTransactions";
import TransactionList from "../../components/transaction/TransactionList/TransactionList";
import { TransactionDoc, AssetSchemeDoc, Type } from "../../../db/DocType";

import "./Asset.scss"
import { H256 } from "codechain-sdk/lib/core/H256";
import HexString from "../../components/util/HexString/HexString";
import { ImageLoader } from "../../components/util/ImageLoader/ImageLoader";
import CopyButton from "../../components/util/CopyButton/CopyButton";

interface Props {
    match: match<{ assetType: string }>;
}

interface State {
    transactions: TransactionDoc[];
    assetScheme?: AssetSchemeDoc;
    notFound: boolean;
    page: number;
    totalTransactionCount: number;
    loadTransaction: boolean;
    noMoreTransaction: boolean;
}

class Asset extends React.Component<Props, State> {
    private itemsPerPage = 3;
    constructor(props: Props) {
        super(props);
        this.state = { notFound: false, transactions: [], page: 1, totalTransactionCount: 0, loadTransaction: true, noMoreTransaction: false };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { assetType } } } = this.props;
        const { match: { params: { assetType: nextType } } } = props;
        if (nextType !== assetType) {
            this.setState({ ...this.state, assetScheme: undefined, transactions: [], page: 1, totalTransactionCount: 0, loadTransaction: true, noMoreTransaction: false });
        }
    }

    public render() {
        const { match: { params: { assetType } } } = this.props;
        const { notFound, assetScheme, transactions, totalTransactionCount, page, loadTransaction, noMoreTransaction } = this.state;

        if (notFound) {
            return (
                <div>
                    <Error content={assetType} title="The asset does not exist." />
                </div>
            )
        }
        if (!assetScheme) {
            return <RequestAssetScheme assetType={assetType} onAssetScheme={this.onAssetScheme} onAssetSchemeNotExist={this.onAssetSchemeNotFound} onError={this.onError} />;
        }
        return (
            <Container className="asset">
                <Row>
                    <Col>
                        <div className="title-container d-flex">
                            <div className="d-inline-block left-container">
                                <ImageLoader size={65} data={new H256(assetType).value} url={Type.getMetadata(assetScheme.metadata).icon_url} />
                            </div>
                            <div className="d-inline-block right-container">
                                <h1>Asset</h1>
                                <div className="hash-container d-flex">
                                    <div className="d-inline-block hash">
                                        <HexString text={new H256(assetType).value} />
                                    </div>
                                    <CopyButton className="d-inline-block" copyString={`0x${new H256(assetType).value}`} />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="mt-large">
                    <AssetDetails assetType={assetType} assetScheme={assetScheme} />
                </div>
                {
                    <RequestTotalAssetTransactionCount assetType={assetType} onTotalCount={this.onTransactionTotalCount} onError={this.onError} />
                }
                {
                    loadTransaction ?
                        <RequestAssetTransactions assetType={assetType} onTransactions={this.onTransactionList} onError={this.onError} page={page} itemsPerPage={this.itemsPerPage} />
                        : null
                }
                {
                    totalTransactionCount !== 0 ?
                        <div className="mt-large">
                            <TransactionList assetType={new H256(assetType)} hideTitle={true} transactions={transactions} totalCount={totalTransactionCount} loadMoreAction={this.loadMoreAction} hideMoreButton={noMoreTransaction} />
                        </div>
                        : null
                }
            </Container>
        )
    }

    private loadMoreAction = () => {
        this.setState({ loadTransaction: true, page: this.state.page + 1 });
    }

    private onTransactionTotalCount = (totalCount: number) => {
        this.setState({ totalTransactionCount: totalCount });
    }

    private onAssetScheme = (assetScheme: AssetSchemeDoc) => {
        this.setState({ assetScheme });
    }

    private onTransactionList = (transactions: TransactionDoc[]) => {
        this.setState({ transactions: this.state.transactions.concat(transactions), loadTransaction: false });
        if (this.state.transactions.length >= this.state.totalTransactionCount) {
            this.setState({ noMoreTransaction: true });
        }
    }

    private onAssetSchemeNotFound = () => {
        this.setState({ notFound: true, loadTransaction: false });
    }

    private onError = (e: any) => {
        console.log(e);
        this.setState({ loadTransaction: false });
    }
}

export default Asset;
