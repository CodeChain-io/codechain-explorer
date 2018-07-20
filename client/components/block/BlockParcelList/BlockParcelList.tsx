import * as React from "react";

import "./BlockParcelList.scss"
import HexString from "../../util/HexString/HexString";
import { Row, Col } from "reactstrap";
import * as arrow from "./img/arrow.png";
import { ParcelDoc, Type, PaymentDoc, ChangeShardStateDoc, SetRegularKeyDoc } from "../../../db/DocType";

interface Props {
    parcels: ParcelDoc[];
}

const ParcelObjectByType = (parcel: ParcelDoc) => {
    if (Type.isPaymentDoc(parcel.action)) {
        return ([
            <Row key="payment-amount">
                <Col md="2">
                    Amount
            </Col>
                <Col md="10">
                    {(parcel.action as PaymentDoc).amount}
                </Col>
            </Row>,
            <Row key="payment-sender-receiver">
                <Col>
                    <div>
                        <Row className="inner-row">
                            <Col md="5" className="background-highlight">
                                <Row>
                                    <Col md="5">
                                        Sender
                                    </Col>
                                    <Col md="7">
                                        <HexString link={`/addr-platform/0x${parcel.sender}`} text={parcel.sender} length={15} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="2" className="text-center">
                                <img src={arrow} alt="arrow" />
                            </Col>
                            <Col md="5" className="background-highlight">
                                <Row>
                                    <Col md="5">
                                        Receiver
                                    </Col>
                                    <Col md="7">
                                        <HexString link={`/addr-platform/0x${(parcel.action as PaymentDoc).receiver}`} text={(parcel.action as PaymentDoc).receiver} length={15} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>])
    } else if (Type.isChangeShardStateDoc(parcel.action)) {
        return <Row>
            <Col>
                <div className="background-highlight">
                    <Row className="inner-row">
                        <Col md="2">
                            # of Txs
                        </Col>
                        <Col md="10">
                            {(parcel.action as ChangeShardStateDoc).transactions.length}
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    } else if (Type.isSetRegularKeyDoc(parcel.action)) {
        return <Row>
            <Col md="2">
                Key
            </Col>
            <Col md="10">
                <HexString text={(parcel.action as SetRegularKeyDoc).key} />
            </Col>
        </Row>
    }
    return null;
}

const getClassNameByType = (type: string) => {
    if (type === "payment") {
        return "payment-type";
    } else if (type === "changeShardState") {
        return "change-shard-state-type";
    } else if (type === "setRegularKey") {
        return "set-regular-key";
    }
    return null;
}

const BlockParcelList = (props: Props) => {
    const { parcels } = props;
    return <div className="block-parcel-list">{parcels.map((parcel, i: number) => {
        const hash = parcel.hash;
        return <div key={`block-parcel-${hash}`} className="parcel-item mb-3">
            <div className={`type ${getClassNameByType(parcel.action.action)}`}>
                {parcel.action.action}
            </div>
            <Row>
                <Col md="2">
                    Parcel
                </Col>
                <Col md="10">
                    <HexString link={`/parcel/0x${hash}`} text={hash} /> (Index {i})
                </Col>
            </Row>
            <Row>
                <Col md="2">
                    Signer
                </Col>
                <Col md="10">
                    <HexString link={`/address/0x${parcel.sender}`} text={parcel.sender} />
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
            {ParcelObjectByType(parcel)}
        </div>
    })}</div >
};

export default BlockParcelList;
