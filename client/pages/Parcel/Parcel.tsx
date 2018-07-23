import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { RequestParcel } from "../../request";
import ParcelDetails from "../../components/parcel/ParcelDetails/ParcelDetails";

import "./Parcel.scss";
import ParcelTransactionList from "../../components/parcel/ParcelTransactionList/ParcelTransactionList";
import { ParcelDoc, Type, ChangeShardStateDoc } from "../../db/DocType";

interface Props {
    match: match<{ hash: string }>;
}

interface State {
    parcel?: ParcelDoc;
    page: number;
}

class Parcel extends React.Component<Props, State> {
    private itemPerPage = 3;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1
        };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { hash } } } = this.props;
        const { match: { params: { hash: nextHash } } } = props;
        if (nextHash !== hash) {
            this.setState({ parcel: undefined, page: 1 });
        }
    }

    public render() {
        const { match: { params: { hash } } } = this.props;
        const { parcel, page } = this.state;
        if (!parcel) {
            return <RequestParcel hash={hash}
                onParcel={this.onParcel}
                onParcelNotExist={this.onParcelNotExist}
                onError={this.onError} />;
        }
        return (<Container className="parcel">
            <div className="title-container mb-2">
                <h1 className="d-inline-block">Parcel Information</h1>
                <div className={`d-inline-block parcel-type ${Type.isChangeShardStateDoc(parcel.action) ? "change-shard-state-type" : (Type.isPaymentDoc(parcel.action) ? "payment-type" : "set-regular-key-type")}`}>
                    <span>{parcel.action.action}</span>
                </div>
            </div>
            <ParcelDetails parcel={parcel} />
            {this.showTransactionList(parcel, page)}
        </Container>
        )
    }

    private showTransactionList = (parcel: ParcelDoc, page: number) => {
        if (Type.isChangeShardStateDoc(parcel.action)) {
            return (
                [
                    <div key="transaction-label" className="transaction-count-label">
                        <span className="blue-color">{(parcel.action as ChangeShardStateDoc).transactions.length} Transactions</span> in this Block
                    </div>,
                    <div key="parcel-transaction" className="mt-3">
                        <ParcelTransactionList transactions={(parcel.action as ChangeShardStateDoc).transactions.slice(0, page * this.itemPerPage)} />
                        {
                            page * this.itemPerPage < (parcel.action as ChangeShardStateDoc).transactions.length ?
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
                ]
            )
        }
        return null;
    }

    private loadMore = (e: any) => {
        e.preventDefault();
        this.setState({ page: this.state.page + 1 })
    }

    private onParcel = (parcel: ParcelDoc) => {
        this.setState({ parcel });
    }

    private onParcelNotExist = () => {
        console.log("parcel not exist");
    }

    private onError = () => ({/* Not implemented */ });
}

export default Parcel;
