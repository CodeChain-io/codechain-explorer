import * as React from "react";

import "./ParcelList.scss"
import HexString from "../../util/HexString/HexString";
import { Row, Col } from "reactstrap";
import * as arrow from "./img/arrow.png";
import { ParcelDoc, Type, PaymentDoc, ChangeShardStateDoc, SetRegularKeyDoc } from "../../../../db/DocType";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";
import { Link } from "react-router-dom";

interface Props {
    parcels: ParcelDoc[];
    address: string;
}

const ParcelObjectByType = (parcel: ParcelDoc, address: string) => {
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
                                        {
                                            address === PlatformAddress.fromAccountId(parcel.sender).value ?
                                                `${PlatformAddress.fromAccountId(parcel.sender).value.slice(0, 15)}...`
                                                : <Link to={`/addr-platform/${PlatformAddress.fromAccountId(parcel.sender).value}`}>{PlatformAddress.fromAccountId(parcel.sender).value.slice(0, 15)}...</Link>
                                        }
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
                                        {
                                            address === PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value ?
                                                `${PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value.slice(0, 15)}...`
                                                : <Link to={`/addr-platform/${PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value}`}>{PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value.slice(0, 15)}...</Link>
                                        }
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

const ParcelList = (props: Props) => {
    const { parcels, address } = props;
    return <div className="parcel-list">{parcels.map((parcel, i: number) => {
        const hash = parcel.hash;
        return <div key={`parcel-${hash}`} className="parcel-item mb-3">
            <div className={`type ${getClassNameByType(parcel.action.action)}`}>
                {parcel.action.action}
            </div>
            <Row>
                <Col md="2">
                    Parcel
                </Col>
                <Col md="10">
                    <HexString link={`/parcel/0x${hash}`} text={hash} />
                </Col>
            </Row>
            <Row>
                <Col md="2">
                    Signer
                </Col>
                <Col md="10">
                    {PlatformAddress.fromAccountId(parcel.sender).value}
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
            {ParcelObjectByType(parcel, address)}
        </div>
    })}</div >
};

export default ParcelList;
