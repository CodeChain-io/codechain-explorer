import * as React from "react";

import { Col, Row } from "reactstrap";

import { CreateShardDoc, ParcelDoc, PaymentDoc, SetRegularKeyDoc } from "codechain-indexer-types/lib/types";
import { Type } from "codechain-indexer-types/lib/utils";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../redux/actions";
import { changeQuarkStringToCCC } from "../../../utils/Formatter";
import { ActionBadge } from "../../util/ActionBadge/ActionBadge";
import { CommaNumberString } from "../../util/CommaNumberString/CommaNumberString";
import DataSet from "../../util/DataSet/DataSet";
import HexString from "../../util/HexString/HexString";
import { StatusBadge } from "../../util/StatusBadge/StatusBadge";
import "./ParcelDetails.scss";

interface ParcelResult {
    parcel: ParcelDoc;
    status: string;
    timestamp?: number;
}

interface OwnProps {
    parcelResult: ParcelResult;
}

interface StateProps {
    bestBlockNumber?: number;
}

type Props = OwnProps & StateProps;

const getElementByType = (parcel: ParcelDoc) => {
    if (Type.isPaymentDoc(parcel.action)) {
        return [
            <Row key="parcel-header-table-payment-sender">
                <Col md="3">Sender</Col>
                <Col md="9">
                    <Link to={`/addr-platform/${parcel.signer}`}>{parcel.signer}</Link>
                </Col>
            </Row>,
            <hr key="line1" />,
            <Row key="parcel-header-table-payment-receiver">
                <Col md="3">Receiver</Col>
                <Col md="9">
                    <Link to={`/addr-platform/${(parcel.action as PaymentDoc).receiver}`}>
                        {(parcel.action as PaymentDoc).receiver}
                    </Link>
                </Col>
            </Row>,
            <hr key="line2" />,
            <Row key="parcel-header-table-payment-amount">
                <Col md="3">Amount</Col>
                <Col md="9">
                    <CommaNumberString text={changeQuarkStringToCCC((parcel.action as PaymentDoc).amount)} />
                    CCC
                </Col>
            </Row>,
            <hr key="line3" />
        ];
    } else if (Type.isSetRegularKeyDoc(parcel.action)) {
        return [
            <Row key="parcel-header-table-regular-key">
                <Col md="3">Key</Col>
                <Col md="9">
                    <div className="text-area">
                        <HexString text={(parcel.action as SetRegularKeyDoc).key} />
                    </div>
                </Col>
            </Row>,
            <hr key="line" />
        ];
    } else if (Type.isAssetTransactionDoc(parcel.action)) {
        return [
            <Row key="parcel-header-table-asset-transaction-group-key">
                <Col md="3"># of Transactions</Col>
                <Col md="9">1</Col>
                {/*<Col md="9">{(parcel.action as AssetTransactionDoc).transactions.length.toLocaleString()}</Col>*/}
            </Row>,
            <hr key="line" />
        ];
    }
    return null;
};

const getParcelInvoice = (parcel: ParcelDoc) => {
    if (
        Type.isPaymentDoc(parcel.action) ||
        Type.isSetRegularKeyDoc(parcel.action) ||
        Type.isCreateShardDoc(parcel.action)
    ) {
        const parcelAction = parcel.action as PaymentDoc | SetRegularKeyDoc | CreateShardDoc;
        return [
            <Row key="invoice-row">
                <Col md="3">Invoice</Col>
                <Col md="9">{parcelAction.invoice ? "Success" : `Fail - ${parcelAction.errorType}`}</Col>
            </Row>,
            <hr key="invoice-hr" />
        ];
    }
    return null;
};

class ParcelDetails extends React.Component<Props> {
    public render() {
        const { parcelResult, bestBlockNumber } = this.props;
        const parcel = parcelResult.parcel;
        const status = parcelResult.status;

        return (
            <div className="parcel-details">
                <Row>
                    <Col>
                        <h2>Details</h2>
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DataSet>
                            <Row>
                                <Col md="3">Action</Col>
                                <Col md="9">
                                    <ActionBadge parcel={parcel} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Block No.</Col>
                                <Col md="9">
                                    <Link to={`/block/${parcel.blockNumber}`}>{parcel.blockNumber}</Link>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Parcel Index</Col>
                                <Col md="9">{parcel.parcelIndex ? parcel.parcelIndex.toLocaleString() : "0"}</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Network ID</Col>
                                <Col md="9">{parcel.networkId}</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Sequence</Col>
                                <Col md="9">
                                    <CommaNumberString text={parcel.seq} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Signer</Col>
                                <Col md="9">
                                    <Link to={`/addr-platform/${parcel.signer}`}>{parcel.signer}</Link>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Fee</Col>
                                <Col md="9">
                                    <CommaNumberString text={changeQuarkStringToCCC(parcel.fee)} />
                                    CCC
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Status</Col>
                                <Col md="9">
                                    {bestBlockNumber && (
                                        <StatusBadge
                                            status={status}
                                            timestamp={parcelResult.timestamp}
                                            bestBlockNumber={bestBlockNumber}
                                            currentBlockNumber={parcel.blockNumber}
                                        />
                                    )}
                                </Col>
                            </Row>
                            <hr />
                            {status === "confirmed" ? getParcelInvoice(parcel) : null}
                            {getElementByType(parcel)}
                        </DataSet>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect((state: RootState) => ({ bestBlockNumber: state.appReducer.bestBlockNumber }))(ParcelDetails);
