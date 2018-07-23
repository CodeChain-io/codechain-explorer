import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { RequestAssetTransferAddressUTXO, RequestAssetTransferAddressTransactions } from "../../request";
import { TransactionDoc, AssetBundleDoc } from "../../db/DocType";

import "./AssetTransferAddress.scss";
import AccountDetails from "../../components/assetTransferAddress/AccountDetails/AccountDetails";
import AssetList from "../../components/assetTransferAddress/AssetList/AssetList";
import TransactionList from "../../components/assetTransferAddress/TransactionList/TransactionList";
import { H256 } from "codechain-sdk/lib/core/classes";

interface Props {
    match: match<{ address: string }>;
}

interface State {
    utxo: AssetBundleDoc[],
    transactions: TransactionDoc[],
    requested: boolean,
    page: number
}

class AssetTransferAddress extends React.Component<Props, State> {
    private itemPerPage = 3;
    constructor(props: Props) {
        super(props);
        this.state = { utxo: [], transactions: [], requested: false, page: 1 };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { address } } } = this.props;
        const { match: { params: { address: nextAddress } } } = props;
        if (nextAddress !== address) {
            this.setState({ utxo: [], transactions: [], requested: false, page: 1 });
        }
    }

    public componentDidMount() {
        this.updateRequestState();
    }

    public render() {
        const { match: { params: { address } } } = this.props;
        const { utxo, transactions, requested, page } = this.state;
        const account = {
            assetCount: utxo.length,
            txCount: transactions.length,
        }
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
                <h1>Asset Transfer Address</h1>
                <AccountDetails address={address} account={account} />
                {
                    utxo.length > 0 ?
                        <div>
                            <h2 className="sub-title">Assets</h2>
                            <hr />
                            <AssetList assetBundles={utxo} />
                        </div>
                        : null
                }
                {
                    transactions.length > 0 ?
                        <div>
                            <h2 className="sub-title">Transactions</h2>
                            <hr />
                            <TransactionList owner={new H256(address)} transactions={transactions.slice(0, this.itemPerPage * page)} />
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
                        : null
                }
            </Container>
        )
    }
    private loadMore = (e: any) => {
        e.preventDefault();
        this.setState({ page: this.state.page + 1 })
    }
    private updateRequestState() {
        this.setState({ requested: true })
    }
    private onTransactions = (transactions: TransactionDoc[]) => {
        this.setState({ transactions });
    }
    private onUTXO = (utxo: AssetBundleDoc[]) => {
        this.setState({ utxo });
    }
    private onError = (e: any) => { console.error(e); }
}

export default AssetTransferAddress;
