import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { RequestAssetTransferAddressUTXO, RequestAssetTransferAddressTransactions } from "../request";
import UTXOList from "../components/assetTransferAddress/UTXOList/UTXOList";
import TransactionList from "../components/transaction/TransactionList/TransactionList";
import { TransactionDoc, AssetBundleDoc } from "../db/DocType";

interface Props {
    match: match<{ address: string }>;
}

interface State {
    utxo: AssetBundleDoc[],
    transactions: TransactionDoc[]
}

class AssetTransferAddress extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { utxo: [], transactions: [] };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { address } } } = this.props;
        const { match: { params: { address: nextAddress } } } = props;
        if (nextAddress !== address) {
            this.setState({ utxo: [], transactions: [] });
        }
    }

    public render() {
        const { match: { params: { address } } } = this.props;
        const { utxo, transactions } = this.state;
        return (
            <div>
                <Container>
                    <h3 className="mt-3">Asset Transfer Address</h3>
                    <p>{address}</p>
                    <h4>UTXO</h4>
                    <UTXOList utxo={utxo} />
                    <h4>History</h4>
                    <TransactionList searchByAssetType={false} transactions={transactions} />
                </Container>
                <RequestAssetTransferAddressUTXO address={address} onUTXO={this.onUTXO} onError={this.onError} />
                <RequestAssetTransferAddressTransactions address={address} onTransactions={this.onTransactions} onError={this.onError} />
            </div>
        )
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
