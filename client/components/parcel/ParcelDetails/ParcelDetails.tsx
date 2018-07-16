import * as React from "react";

import { SignedParcel, Payment, SetRegularKey } from "codechain-sdk/lib/core/classes";
import { Col, Row } from 'reactstrap';

import "./ParcelDetails.scss"
import HexString from "../../util/HexString/HexString";

interface Props {
    parcel: SignedParcel;
}

const getElementByType = (parcel: SignedParcel) => {
    if (parcel.unsigned.action instanceof Payment) {
        return [
            <Row key="parcel-header-table-payment-sender" className="first-row-in-custom">
                <Col md="2">
                    Sender
                </Col>
                <Col md="10">
                    <HexString link={`/addr-platform/0x${parcel.getSender().value}`} text={parcel.getSender().value} />

                </Col>
            </Row>,
            <Row key="parcel-header-table-payment-receiver">
                <Col md="2">
                    Receiver
                </Col>
                <Col md="10">
                    <HexString link={`/addr-platform/0x${parcel.unsigned.action.receiver.value}`} text={parcel.unsigned.action.receiver.value} />
                </Col>
            </Row>,
            <Row key="parcel-header-table-payment-amount">
                <Col md="2">
                    Amount
                </Col>
                <Col md="10">
                    {parcel.unsigned.action.amount.value.toString()}
                </Col>
            </Row>
        ];
    } else if (parcel.unsigned.action instanceof SetRegularKey) {
        return <Row className="first-row-in-custom">
            <Col md="2">
                Key
            </Col>
            <Col md="10">
                <HexString text={parcel.unsigned.action.key.value} />
            </Col>
        </Row>;
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
                <HexString text={parcel.hash().value} />
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Network ID
            </Col>
            <Col md="10">
                {parcel.unsigned.networkId.value.toString()}
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Block No.
            </Col>
            <Col md="10">
                {parcel.blockNumber}
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
                {parcel.unsigned.nonce.value.toString()}
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Signer
            </Col>
            <Col md="10">
                <HexString link={`/addr-platform/0x${parcel.getSender().value}`} text={parcel.getSender().value} />
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Fee
            </Col>
            <Col md="10">
                {parcel.unsigned.fee.value.toString()}
            </Col>
        </Row>
        {
            getElementByType(parcel)
        }
    </div>
};

export default ParcelDetails;
