import * as React from "react";

import { Col, Row } from "reactstrap";

import { Link } from "react-router-dom";
import {
    ChangeShardStateDoc,
    CreateShardDoc,
    ParcelDoc,
    PaymentDoc,
    SetRegularKeyDoc,
    Type
} from "../../../../db/DocType";
import { changeQuarkStringToCCC } from "../../../utils/Formatter";
import { ActionBadge } from "../../util/ActionBadge/ActionBadge";
import { CommaNumberString } from "../../util/CommaNumberString/CommaNumberString";
import HexString from "../../util/HexString/HexString";
import { StatusBadge } from "../../util/StatusBadge/StatusBadge";
import "./ParcelDetails.scss";

interface Props {
    parcel: ParcelDoc;
    status: string;
}

const getElementByType = (parcel: ParcelDoc) => {
    if (Type.isPaymentDoc(parcel.action)) {
        return [
            <Row key="parcel-header-table-payment-sender">
                <Col md="3">Sender</Col>
                <Col md="9">
                    <Link to={`/addr-platform/${parcel.sender}`}>
                        {parcel.sender}
                    </Link>
                </Col>
            </Row>,
            <hr key="line1" />,
            <Row key="parcel-header-table-payment-receiver">
                <Col md="3">Receiver</Col>
                <Col md="9">
                    <Link
                        to={`/addr-platform/${
                            (parcel.action as PaymentDoc).receiver
                        }`}
                    >
                        {(parcel.action as PaymentDoc).receiver}
                    </Link>
                </Col>
            </Row>,
            <hr key="line2" />,
            <Row key="parcel-header-table-payment-amount">
                <Col md="3">Amount</Col>
                <Col md="9">
                    <CommaNumberString
                        text={changeQuarkStringToCCC(
                            (parcel.action as PaymentDoc).amount
                        )}
                    />
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
                        <HexString
                            text={(parcel.action as SetRegularKeyDoc).key}
                        />
                    </div>
                </Col>
            </Row>,
            <hr key="line" />
        ];
    } else if (Type.isChangeShardStateDoc(parcel.action)) {
        return [
            <Row key="parcel-header-table-change-shard-state-key">
                <Col md="3"># of Transactions</Col>
                <Col md="9">
                    {(parcel.action as ChangeShardStateDoc).transactions.length.toLocaleString()}
                </Col>
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
        const parcelAction = parcel.action as
            | PaymentDoc
            | SetRegularKeyDoc
            | CreateShardDoc;
        return [
            <Row key="invoice-row">
                <Col md="3">Invoice</Col>
                <Col md="9">
                    {parcelAction.invoice
                        ? "Success"
                        : `Fail - ${parcelAction.errorType}`}
                </Col>
            </Row>,
            <hr key="invoice-hr" />
        ];
    }
    return null;
};

const ParcelDetails = (props: Props) => {
    const { parcel, status } = props;

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
                    <div className="data-set">
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
                                <Link to={`/block/${parcel.blockNumber}`}>
                                    {parcel.blockNumber}
                                </Link>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">Parcel Index</Col>
                            <Col md="9">
                                {parcel.parcelIndex
                                    ? parcel.parcelIndex.toLocaleString()
                                    : 0}
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">Network ID</Col>
                            <Col md="9">{parcel.networkId}</Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">Nonce</Col>
                            <Col md="9">
                                <CommaNumberString text={parcel.nonce} />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">Signer</Col>
                            <Col md="9">
                                <Link to={`/addr-platform/${parcel.sender}`}>
                                    {parcel.sender}
                                </Link>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">Fee</Col>
                            <Col md="9">
                                <CommaNumberString
                                    text={changeQuarkStringToCCC(parcel.fee)}
                                />
                                CCC
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">Status</Col>
                            <Col md="9">
                                <StatusBadge status={status} />
                            </Col>
                        </Row>
                        <hr />
                        {status === "confirmed"
                            ? getParcelInvoice(parcel)
                            : null}
                        {getElementByType(parcel)}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default ParcelDetails;
