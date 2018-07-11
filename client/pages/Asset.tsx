import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { RequestAssetScheme } from "../request";
import { AssetScheme as CoreAssetScheme, Transaction } from "codechain-sdk/lib/core/classes";
import AssetDetails from "../components/asset/AssetDetails/AssetDetails";
import RequestAssetTransactions from "../request/RequestAssetTransactions";
import TransactionList from "../components/transaction/TransactionList/TransactionList";

interface Props {
    match: match<{ type: string }>;
}

interface State {
    transactions: Transaction[];
    assetScheme?: CoreAssetScheme;
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
            <div>
                <Container>
                    {assetScheme
                        ? <div><AssetDetails assetScheme={assetScheme} /></div>
                        : <div><RequestAssetScheme assetType={type} onAssetScheme={this.onAssetScheme} onNotFound={this.onAssetSchemeNotFound} onError={this.onError} /></div>}
                    <div>{/* FIXME: Modify name of ParcelTransactionList */}</div>
                    {
                        transactions.length !== 0 ? <div><TransactionList searchByAssetType={true} transactions={transactions} /></div> : <RequestAssetTransactions assetType={type} onTransactions={this.onTransactionList} onError={this.onError} />
                    }
                </Container>
            </div>
        )
    }

    private onAssetScheme = (assetScheme: CoreAssetScheme) => {
        this.setState({ assetScheme });
    }

    private onTransactionList = (transactions: Transaction[]) => {
        this.setState({ transactions })
    }

    private onAssetSchemeNotFound = () => console.error("AssetScheme not found");

    private onError = (e: any) => console.error(e);
}

export default Asset;
