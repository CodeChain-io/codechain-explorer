import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { RequestParcel } from "../../request";
import ParcelDetails from "../../components/parcel/ParcelDetails/ParcelDetails";

import "./Parcel.scss";
import ParcelTransactionList from "../../components/parcel/ParcelTransactionList/ParcelTransactionList";
import { ParcelDoc, Type, ChangeShardStateDoc } from "../../../db/DocType";
import RequestPendingParcel from "../../request/RequestPendingParcel";
import { PendingParcelDoc } from "../../../db/DocType";

interface Props {
    match: match<{ hash: string }>;
}

interface ParcelResult {
    parcel: ParcelDoc;
    status: string;
}

interface State {
    parcelResult?: ParcelResult;
    notExistedInBlock: boolean;
    notExistedInPendingParcel: boolean;
    page: number;
}

class Parcel extends React.Component<Props, State> {
    private itemPerPage = 3;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1,
            notExistedInBlock: false,
            notExistedInPendingParcel: false
        };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { hash } } } = this.props;
        const { match: { params: { hash: nextHash } } } = props;
        if (nextHash !== hash) {
            this.setState({ parcelResult: undefined, page: 1, notExistedInBlock: false, notExistedInPendingParcel: false });
        }
    }

    public render() {
        const { match: { params: { hash } } } = this.props;
        const { parcelResult, page, notExistedInBlock, notExistedInPendingParcel } = this.state;
        if (!parcelResult) {
            if (!notExistedInBlock) {
                return <RequestParcel hash={hash}
                    onParcel={this.onParcel}
                    onParcelNotExist={this.onParcelNotExist}
                    onError={this.onError} />;
            } else if (!notExistedInPendingParcel) {
                return <RequestPendingParcel hash={hash} onError={this.onError} onPendingParcel={this.onPendingParcel} onPendingParcelNotExist={this.onPendingParcelNotExist} />
            } else {
                return <div>{hash} not found.</div>
            }
        }
        return (<Container className="parcel">
            <div className="title-container mb-2 d-flex align-items-center">
                <h1 className="d-inline-block">Parcel Information</h1>
                <div className={`mr-auto d-inline-block parcel-type ${Type.isChangeShardStateDoc(parcelResult.parcel.action) ? "change-shard-state-type" : (Type.isPaymentDoc(parcelResult.parcel.action) ? "payment-type" : "set-regular-key-type")}`}>
                    <span>{parcelResult.parcel.action.action}</span>
                </div>
                <div className="d-inline-block">
                    {
                        this.getStatusElement(parcelResult.status)
                    }
                </div>
            </div>
            <ParcelDetails parcel={parcelResult.parcel} />
            {this.showTransactionList(parcelResult.parcel, page)}
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

    private getStatusElement = (status: string) => {
        switch (status) {
            case "dead":
                return <div className="dead"><FontAwesome name="circle" />&nbsp;Dead</div>
            case "confirmed":
                return <div className="confirmed"><FontAwesome name="circle" />&nbsp;Confirmed</div>
            case "pending":
                return <div className="pending"><FontAwesome name="circle" />&nbsp;Pending</div >
        }
        return null;
    }

    private loadMore = (e: any) => {
        e.preventDefault();
        this.setState({ page: this.state.page + 1 })
    }

    private onPendingParcel = (pendingParcel: PendingParcelDoc) => {
        const parcelResult = {
            parcel: pendingParcel.parcel,
            status: pendingParcel.status
        }
        this.setState({ parcelResult });
    }

    private onPendingParcelNotExist = () => {
        this.setState({ notExistedInPendingParcel: true });
    }
    private onParcel = (parcel: ParcelDoc) => {
        const parcelResult = {
            parcel,
            status: "confirmed"
        }
        this.setState({ parcelResult });
    }

    private onParcelNotExist = () => {
        this.setState({ notExistedInBlock: true });
    }

    private onError = (e: any) => {
        console.log(e);
    };
}

export default Parcel;
