import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { RequestAssetScheme } from "../../request";
import AssetDetails from "../../components/asset/AssetDetails/AssetDetails";
import RequestAssetTransactions from "../../request/RequestAssetTransactions";
import AssetTransactionList from "../../components/asset/AssetTransactionList/AssetTransactionList";
import { TransactionDoc, AssetSchemeDoc } from "../../db/DocType";

import "./Asset.scss"
import { H256 } from "codechain-sdk/lib/core/H256";

interface Props {
    match: match<{ type: string }>;
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
        const { match: { params: { type } } } = this.props;
        const { match: { params: { type: nextType } } } = props;
        if (nextType !== type) {
            this.setState({ ...this.state, assetScheme: undefined, transactions: [] });
        }
    }

    public render() {
        const { match: { params: { type } } } = this.props;
        const { notFound, assetScheme, transactions } = this.state;
        if (notFound) {
            return <div><Container>Asset not exist for type: {type}</Container></div>
        }
        return (
            <Container className="asset">
                <h1>Asset Information</h1>
                {assetScheme
                    ? <div><AssetDetails assetType={type} assetScheme={assetScheme} /></div>
                    : <div><RequestAssetScheme assetType={type} onAssetScheme={this.onAssetScheme} onNotFound={this.onAssetSchemeNotFound} onError={this.onError} /></div>}
                <h2 className="sub-title">Transaction History</h2>
                {
                    transactions.length !== 0 ?
                        <div>
                            <AssetTransactionList type={new H256(type)} transactions={transactions} />
                        </div>
                        : <RequestAssetTransactions assetType={type} onTransactions={this.onTransactionList} onError={this.onError} />
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
