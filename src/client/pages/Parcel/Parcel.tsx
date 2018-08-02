import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import * as moment from "moment";
import { match } from "react-router";
import { Container, Row, Col } from "reactstrap";

import { RequestParcel, RequestPendingParcel } from "../../request";
import ParcelDetails from "../../components/parcel/ParcelDetails/ParcelDetails";

import "./Parcel.scss";
import TransactionList from "../../components/transaction/TransactionList/TransactionList";
import { ParcelDoc, Type, ChangeShardStateDoc, PendingParcelDoc } from "../../../db/DocType";
import HexString from "../../components/util/HexString/HexString";
import { ActionBadge } from "../../components/util/ActionBadge/ActionBadge";

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
}

class Parcel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            notExistedInBlock: false,
            notExistedInPendingParcel: false
        };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { hash } } } = this.props;
        const { match: { params: { hash: nextHash } } } = props;
        if (nextHash !== hash) {
            this.setState({ parcelResult: undefined, notExistedInBlock: false, notExistedInPendingParcel: false });
        }
    }

    public render() {
        const { match: { params: { hash } } } = this.props;
        const { parcelResult, notExistedInBlock, notExistedInPendingParcel } = this.state;
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
            <Row className="mb-2">
                <Col md="8" xl="7">
                    <div className="d-flex title-container">
                        <h1 className="d-inline-block align-self-center">Parcel</h1>
                        <ActionBadge className="align-self-center ml-3 mr-auto" parcel={parcelResult.parcel} />
                        <span className="timestamp align-self-end">{moment.unix(parcelResult.parcel.timestamp).format("YYYY-MM-DD HH:mm:ssZ")}</span>
                    </div>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col md="8" xl="7" className="hash-container d-flex mb-3 mb-md-0">
                    <div className="d-inline-block hash">
                        <HexString text={parcelResult.parcel.hash} />
                    </div>
                    <div className="d-inline-block copy text-center">
                        <FontAwesome name="copy" />
                    </div>
                </Col>
            </Row>
            <ParcelDetails parcel={parcelResult.parcel} />
            {this.showTransactionList(parcelResult.parcel)}
        </Container>
        )
    }

    private showTransactionList = (parcel: ParcelDoc) => {
        if (Type.isChangeShardStateDoc(parcel.action)) {
            return (
                [
                    <div key="parcel-transaction" className="mt-3">
                        <TransactionList fullScreen={false} transactions={(parcel.action as ChangeShardStateDoc).transactions} />
                    </div>
                ]
            )
        }
        return null;
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
