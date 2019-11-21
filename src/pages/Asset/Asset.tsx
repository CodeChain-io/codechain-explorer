import * as React from "react";
import { match } from "react-router";
import { Col, Container, Row } from "reactstrap";
import { Error } from "../../components/error/Error/Error";

import { AggsUTXODoc, AssetSchemeDoc, TransactionDoc } from "codechain-indexer-types";
import AssetDetails from "../../components/asset/AssetDetails/AssetDetails";
import AssetOwners from "../../components/asset/AssetOwners/AssetOwners";
import TransactionList from "../../components/transaction/TransactionList/TransactionList";
import { RequestAssetScheme, RequestTransactions } from "../../request";
import RequestAssetTypeUTXO from "../../request/RequestAssetTypeUTXO";

import { H160 } from "codechain-sdk/lib/core/classes";
import { TransactionsResponse } from "src/request/RequestTransactions";
import CopyButton from "../../components/util/CopyButton/CopyButton";
import HexString from "../../components/util/HexString/HexString";
import { ImageLoader } from "../../components/util/ImageLoader/ImageLoader";
import "./Asset.scss";

interface Props {
    match: match<{ assetType: string }>;
}

interface State {
    transactions: TransactionDoc[];
    aggsUTXO: AggsUTXODoc[];
    assetScheme?: AssetSchemeDoc;
    loadTransaction: boolean;
    loadAggsUTXO: boolean;
    noMoreTransaction: boolean;
    lastEvaluatedKeyForTransactions?: string;
    notExistedInBlock: boolean;
}

class Asset extends React.Component<Props, State> {
    private itemsPerPage = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            transactions: [],
            aggsUTXO: [],
            loadTransaction: true,
            loadAggsUTXO: true,
            noMoreTransaction: false,
            notExistedInBlock: false
        };
    }

    public componentWillReceiveProps(props: Props) {
        const {
            match: {
                params: { assetType }
            }
        } = this.props;
        const {
            match: {
                params: { assetType: nextType }
            }
        } = props;
        if (nextType !== assetType) {
            this.setState({
                ...this.state,
                assetScheme: undefined,
                transactions: [],
                loadTransaction: true,
                loadAggsUTXO: true,
                noMoreTransaction: false,
                notExistedInBlock: false
            });
        }
    }

    public render() {
        const {
            match: {
                params: { assetType }
            }
        } = this.props;
        const {
            notExistedInBlock,
            assetScheme,
            transactions,
            aggsUTXO,
            loadTransaction,
            loadAggsUTXO,
            noMoreTransaction,
            lastEvaluatedKeyForTransactions
        } = this.state;

        if (!assetScheme) {
            if (!notExistedInBlock) {
                return (
                    <RequestAssetScheme
                        assetType={assetType}
                        onAssetScheme={this.onAssetScheme}
                        onAssetSchemeNotExist={this.onAssetSchemeNotFound}
                        onError={this.onError}
                    />
                );
            } else {
                return (
                    <div>
                        <Error content={assetType} title="The asset does not exist." />
                    </div>
                );
            }
        }
        return (
            <Container className="asset animated fadeIn">
                <Row>
                    <Col>
                        <div className="title-container d-flex">
                            <div className="d-inline-block left-container">
                                <ImageLoader size={65} data={new H160(assetType).value} isAssetImage={true} />
                            </div>
                            <div className="d-inline-block right-container">
                                <h1>Asset</h1>
                                <div className="hash-container d-flex">
                                    <div className="d-inline-block hash">
                                        <HexString text={new H160(assetType).value} />
                                    </div>
                                    <CopyButton
                                        className="d-inline-block"
                                        copyString={`0x${new H160(assetType).value}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="mt-large">
                    <AssetDetails assetType={assetType} assetScheme={assetScheme} />
                </div>
                {loadAggsUTXO ? (
                    <RequestAssetTypeUTXO assetType={assetType} onAggsUTXOs={this.onAggsUTXOs} onError={this.onError} />
                ) : null}
                {aggsUTXO.length !== 0 ? (
                    <div className="mt-large">
                        <AssetOwners aggsUTXO={aggsUTXO} />
                    </div>
                ) : null}
                {loadTransaction ? (
                    <RequestTransactions
                        lastEvaluatedKey={lastEvaluatedKeyForTransactions}
                        itemsPerPage={this.itemsPerPage}
                        assetType={assetType}
                        showProgressBar={false}
                        onTransactions={this.onTransactions}
                        onError={this.onError}
                    />
                ) : null}
                {transactions.length !== 0 ? (
                    <div className="mt-large">
                        <TransactionList
                            assetType={new H160(assetType)}
                            transactions={transactions}
                            loadMoreAction={this.loadMoreAction}
                            hideMoreButton={noMoreTransaction}
                        />
                    </div>
                ) : null}
            </Container>
        );
    }

    private loadMoreAction = () => {
        this.setState({ loadTransaction: true });
    };

    private onAssetScheme = (assetScheme: AssetSchemeDoc) => {
        this.setState({ assetScheme });
    };

    private onTransactions = (response: TransactionsResponse) => {
        const { data: transactions, hasNextPage, lastEvaluatedKey } = response;
        this.setState({
            transactions: this.state.transactions.concat(transactions),
            noMoreTransaction: !hasNextPage,
            lastEvaluatedKeyForTransactions: lastEvaluatedKey,
            loadTransaction: false
        });
    };

    private onAggsUTXOs = (aggsUTXO: AggsUTXODoc[]) => {
        this.setState({ aggsUTXO, loadAggsUTXO: false });
    };

    private onAssetSchemeNotFound = () => {
        this.setState({ notExistedInBlock: true });
    };

    private onError = (e: any) => {
        console.log(e);
    };
}

export default Asset;
