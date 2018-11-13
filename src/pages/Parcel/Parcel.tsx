import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { match } from "react-router";
import { Col, Container, Row } from "reactstrap";
import { Error } from "../../components/error/Error/Error";

import ParcelDetails from "../../components/parcel/ParcelDetails/ParcelDetails";
import { RequestParcel, RequestPendingParcel } from "../../request";

import { AssetTransactionDoc, ParcelDoc, PendingParcelDoc } from "codechain-indexer-types/lib/types";
import { Type } from "codechain-indexer-types/lib/utils";
import TransactionList from "../../components/transaction/TransactionList/TransactionList";
import CopyButton from "../../components/util/CopyButton/CopyButton";
import HexString from "../../components/util/HexString/HexString";
import "./Parcel.scss";

interface Props {
    match: match<{ hash: string }>;
}

interface ParcelResult {
    parcel: ParcelDoc;
    status: string;
    timestamp?: number;
}

interface State {
    parcelResult?: ParcelResult;
    notExistedInBlock: boolean;
    notExistedInPendingParcel: boolean;
    refresh: boolean;
}

class Parcel extends React.Component<Props, State> {
    private interval: NodeJS.Timer;
    constructor(props: Props) {
        super(props);
        this.state = {
            notExistedInBlock: false,
            notExistedInPendingParcel: false,
            refresh: false
        };
    }

    public componentWillReceiveProps(props: Props) {
        const {
            match: {
                params: { hash }
            }
        } = this.props;
        const {
            match: {
                params: { hash: nextHash }
            }
        } = props;
        if (nextHash !== hash) {
            this.setState({
                parcelResult: undefined,
                notExistedInBlock: false,
                notExistedInPendingParcel: false
            });
        }
    }

    public componentDidMount() {
        this.interval = setInterval(() => {
            if (this.state.parcelResult && this.state.parcelResult.status === "pending") {
                this.setState({
                    refresh: true
                });
            }
        }, 5000);
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    public render() {
        const {
            match: {
                params: { hash }
            }
        } = this.props;
        const { parcelResult, notExistedInBlock, notExistedInPendingParcel, refresh } = this.state;
        if (!parcelResult) {
            if (!notExistedInBlock) {
                return (
                    <RequestParcel
                        hash={hash}
                        onParcel={this.onParcel}
                        onParcelNotExist={this.onParcelNotExist}
                        onError={this.onError}
                    />
                );
            } else if (!notExistedInPendingParcel) {
                return (
                    <RequestPendingParcel
                        hash={hash}
                        onError={this.onError}
                        onPendingParcel={this.onPendingParcel}
                        onPendingParcelNotExist={this.onPendingParcelNotExist}
                    />
                );
            } else {
                return (
                    <div>
                        <Error content={hash} title="The parcel does not exist." />
                    </div>
                );
            }
        }
        return (
            <Container className="parcel animated fadeIn">
                {this.state.parcelResult && this.state.parcelResult.status === "pending" && refresh ? (
                    <RequestPendingParcel
                        hash={hash}
                        onError={this.onError}
                        onPendingParcel={this.onPendingParcel}
                        onPendingParcelNotExist={this.onRefreshPendingParcelNotExist}
                    />
                ) : null}
                <Row>
                    <Col md="8" xl="7">
                        <div className="d-flex title-container">
                            <h1 className="d-inline-block align-self-center mr-auto">Parcel</h1>
                            {parcelResult.status === "confirmed" ? (
                                <span className="timestamp align-self-end">
                                    {moment.unix(parcelResult.parcel.timestamp).format("YYYY-MM-DD HH:mm:ssZ")}
                                </span>
                            ) : null}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="8" xl="7" className="hash-container d-flex">
                        <div className="d-inline-block hash">
                            <HexString text={parcelResult.parcel.hash} />
                        </div>
                        <CopyButton className="d-inline-block" copyString={`0x${parcelResult.parcel.hash}`} />
                    </Col>
                </Row>
                <Row className="mt-large">
                    <Col>
                        <ParcelDetails parcelResult={parcelResult} />
                    </Col>
                </Row>
                <Row>
                    <Col>{this.showTransactionList(parcelResult.parcel)}</Col>
                </Row>
            </Container>
        );
    }

    private showTransactionList = (parcel: ParcelDoc) => {
        if (Type.isAssetTransactionDoc(parcel.action)) {
            return [
                <div key="parcel-transaction" className="mt-large">
                    <TransactionList
                        transactions={[(parcel.action as AssetTransactionDoc).transaction]}
                        totalCount={1}
                    />
                </div>
            ];
        }
        return null;
    };

    private onPendingParcel = (pendingParcel: PendingParcelDoc) => {
        const parcelResult = {
            parcel: pendingParcel.parcel,
            status: pendingParcel.status,
            timestamp: pendingParcel.timestamp
        };
        this.setState({ parcelResult, refresh: false });
    };
    private onRefreshPendingParcelNotExist = () => {
        this.setState({
            parcelResult: undefined,
            notExistedInBlock: false,
            notExistedInPendingParcel: false
        });
    };
    private onPendingParcelNotExist = () => {
        this.setState({ notExistedInPendingParcel: true });
    };
    private onParcel = (parcel: ParcelDoc) => {
        const parcelResult = {
            parcel,
            status: "confirmed"
        };
        this.setState({ parcelResult });
    };

    private onParcelNotExist = () => {
        this.setState({ notExistedInBlock: true });
    };

    private onError = (e: any) => {
        console.log(e);
    };
}

export default Parcel;
