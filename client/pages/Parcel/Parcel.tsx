import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { SignedParcel, ChangeShardState, Payment } from "codechain-sdk/lib/core/classes";

import { RequestParcel } from "../../request";
import ParcelDetails from "../../components/parcel/ParcelDetails/ParcelDetails";
import TransactionList from "../../components/transaction/TransactionList/TransactionList";

import "./Parcel.scss";

interface Props {
    match: match<{ hash: string }>;
}

interface State {
    parcel?: SignedParcel;
}

class Parcel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { hash } } } = this.props;
        const { match: { params: { hash: nextHash } } } = props;
        if (nextHash !== hash) {
            this.setState({ parcel: undefined });
        }
    }

    public render() {
        const { match: { params: { hash } } } = this.props;
        const { parcel } = this.state;
        if (!parcel) {
            return <RequestParcel hash={hash}
                onParcel={this.onParcel}
                onParcelNotExist={this.onParcelNotExist}
                onError={this.onError} />;
        }
        return (<Container className="parcel">
            <div className="title-container mb-2">
                <h1 className="d-inline-block">Parcel Information</h1>
                <div className={`d-inline-block parcel-type ${parcel.unsigned.action instanceof ChangeShardState ? "change-shard-state-type" : (parcel.unsigned.action instanceof Payment ? "payment-type" : "set-regular-key-type")}`}>
                    <span>{parcel.unsigned.action.toJSON().action}</span>
                </div>
            </div>
            <ParcelDetails parcel={parcel} />
            {this.showTransactionList(parcel)}
        </Container>
        )
    }

    private showTransactionList = (parcel: SignedParcel) => {
        if (parcel.unsigned.action instanceof ChangeShardState) {
            return (
                [
                    <div key="1" className="transaction-count-label">
                        <span className="blue-color">{parcel.unsigned.action.transactions.length} Transactions</span> in this Block
                    </div>,
                    <TransactionList key="2" searchByAssetType={false} transactions={parcel.unsigned.action.transactions} />
                ]
            )
        }
        return null;
    }

    private onParcel = (parcel: SignedParcel) => {
        this.setState({ parcel });
    }

    private onParcelNotExist = () => {
        console.log("parcel not exist");
    }

    private onError = () => ({/* Not implemented */ });
}

export default Parcel;
