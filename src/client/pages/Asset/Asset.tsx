import * as React from "react";
import { match } from "react-router";
import { Container } from "reactstrap";

import { RequestAssetScheme } from "../../request";
import AssetDetails from "../../components/asset/AssetDetails/AssetDetails";
import RequestAssetTransactions from "../../request/RequestAssetTransactions";
import AssetTransactionList from "../../components/asset/AssetTransactionList/AssetTransactionList";
import { TransactionDoc, AssetSchemeDoc } from "../../../db/DocType";

import "./Asset.scss"
import { H256 } from "codechain-sdk/lib/core/H256";

interface Props {
    match: match<{ type: string }>;
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
        const { match: { params: { type } } } = this.props;
        const { match: { params: { type: nextType } } } = props;
        if (nextType !== type) {
            this.setState({ ...this.state, assetScheme: undefined, transactions: [], page: 1 });
        }
    }

    public render() {
        const { match: { params: { type } } } = this.props;
        const { notFound, assetScheme, transactions, page } = this.state;
        if (notFound) {
            return <div><Container>Asset not exist for type: {type}</Container></div>
        }
        return (
            <Container className="asset">
                <h1>Asset Information</h1>
                {assetScheme
                    ? <div><AssetDetails assetType={type} assetScheme={assetScheme} /></div>
                    : <div><RequestAssetScheme assetType={type} onAssetScheme={this.onAssetScheme} onAssetSchemeNotExist={this.onAssetSchemeNotFound} onError={this.onError} /></div>}
                <h2 className="sub-title">Transaction History</h2>
                {
                    transactions.length !== 0 ?
                        <div>
                            <AssetTransactionList type={new H256(type)} transactions={transactions.slice(0, this.itemPerPage * page)} />
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
                        : <RequestAssetTransactions assetType={type} onTransactions={this.onTransactionList} onError={this.onError} />
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
