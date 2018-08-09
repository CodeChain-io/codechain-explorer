import * as React from "react";
import * as moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";
import { match } from "react-router";
import { Container, Row, Col } from "reactstrap";
import { Error } from "../../components/error/Error/Error";

import { RequestParcel, RequestPendingParcel } from "../../request";
import ParcelDetails from "../../components/parcel/ParcelDetails/ParcelDetails";

import "./Parcel.scss";
import TransactionList from "../../components/transaction/TransactionList/TransactionList";
import { ParcelDoc, Type, ChangeShardStateDoc, PendingParcelDoc } from "../../../db/DocType";
import HexString from "../../components/util/HexString/HexString";
import CopyButton from "../../components/util/CopyButton/CopyButton";

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
                return (
                    <div>
                        <Error content={hash} title="The parcel does not exist." />
                    </div>
                )
            }
        }
        return (<Container className="parcel">
            <Row>
                <Col md="8" xl="7">
                    <div className="d-flex title-container">
                        <h1 className="d-inline-block align-self-center mr-auto">Parcel</h1>
                        <span className="timestamp align-self-end">{moment.unix(parcelResult.parcel.timestamp).format("YYYY-MM-DD HH:mm:ssZ")}</span>
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
                <Col lg={Type.isChangeShardStateDoc(parcelResult.parcel.action) ? "9" : "12"}>
                    <ParcelDetails parcel={parcelResult.parcel} status={parcelResult.status} />
                </Col>
                {
                    Type.isChangeShardStateDoc(parcelResult.parcel.action) ?
                        <Col lg="3">
                            <div className="right-panel-item mt-3 mt-lg-0">
                                <h2># of Transaction types</h2>
                                <hr />
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon className="square asset-transfer-transaction-text-color" icon={faSquare} />
                                    <span className="mr-auto item-name">Transfer</span>
                                    <span>
                                        {
                                            _.filter((parcelResult.parcel.action as ChangeShardStateDoc).transactions, (tx) => Type.isAssetTransferTransactionDoc(tx)).length
                                        }
                                    </span>
                                </div>
                                <hr />
                                <div className="d-flex align-items-center">
                                    <FontAwesomeIcon className="square asset-mint-transaction-text-color" icon={faSquare} />
                                    <span className="mr-auto item-name">Mint</span>
                                    <span>
                                        {
                                            _.filter((parcelResult.parcel.action as ChangeShardStateDoc).transactions, (tx) => Type.isAssetMintTransactionDoc(tx)).length
                                        }
                                    </span>
                                </div>
                            </div>
                        </Col>
                        : null
                }
            </Row>
            <Row>
                <Col lg="9">
                    {this.showTransactionList(parcelResult.parcel)}
                </Col>
            </Row>
        </Container>
        )
    }

    private showTransactionList = (parcel: ParcelDoc) => {
        if (Type.isChangeShardStateDoc(parcel.action)) {
            return (
                [
                    <div key="parcel-transaction" className="mt-large">
                        <TransactionList transactions={(parcel.action as ChangeShardStateDoc).transactions} />
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
