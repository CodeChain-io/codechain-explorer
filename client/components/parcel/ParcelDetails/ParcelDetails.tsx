import * as React from "react";

import { Col, Row } from 'reactstrap';

import "./ParcelDetails.scss"
import HexString from "../../util/HexString/HexString";
import { ParcelDoc, Type, PaymentDoc, SetRegularKeyDoc } from "../../../db/DocType";
import { Link } from "react-router-dom";

interface Props {
    parcel: ParcelDoc;
}

const getElementByType = (parcel: ParcelDoc) => {
    if (Type.isPaymentDoc(parcel.action)) {
        return [
            <div key="parcel-header-table-payment-line" className="line" />,
            <Row key="parcel-header-table-payment-sender">
                <Col md="2">
                    Sender
                </Col>
                <Col md="10">
                    <HexString link={`/addr-platform/0x${parcel.sender}`} text={parcel.sender} />

                </Col>
            </Row>,
            <Row key="parcel-header-table-payment-receiver">
                <Col md="2">
                    Receiver
                </Col>
                <Col md="10">
                    <HexString link={`/addr-platform/0x${(parcel.action as PaymentDoc).receiver}`} text={(parcel.action as PaymentDoc).receiver} />
                </Col>
            </Row>,
            <Row key="parcel-header-table-payment-amount">
                <Col md="2">
                    Amount
                </Col>
                <Col md="10">
                    {(parcel.action as PaymentDoc).amount}
                </Col>
            </Row>
        ];
    } else if (Type.isSetRegularKeyDoc(parcel.action)) {
        return (
            [
                <div key="parcel-header-table-regular-key-line" className="line" />,
                <Row key="parcel-header-table-regular-key">
                    <Col md="2">
                        Key
                    </Col>
                    <Col md="10">
                        <HexString text={(parcel.action as SetRegularKeyDoc).key} />
                    </Col>
                </Row >
            ]);
    }
    return null;
}

const ParcelDetails = (props: Props) => {
    const { parcel } = props;

    return <div className="parcel-details">
        <Row>
            <Col md="2">
                Hash
            </Col>
            <Col md="10">
                <HexString text={parcel.hash} />
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Network ID
            </Col>
            <Col md="10">
                {parcel.networkId}
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Block No.
            </Col>
            <Col md="10">
                <Link to={`/block/${parcel.blockNumber}`}>
                    {parcel.blockNumber}
                </Link>
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Parcel Index
            </Col>
            <Col md="10">
                {parcel.parcelIndex}
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Nonce
            </Col>
            <Col md="10">
                {parcel.nonce}
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Signer
            </Col>
            <Col md="10">
                <HexString link={`/addr-platform/0x${parcel.sender}`} text={parcel.sender} />
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Fee
            </Col>
            <Col md="10">
                {parcel.fee}
            </Col>
        </Row>
        {
            getElementByType(parcel)
        }
    </div>
};

export default ParcelDetails;
