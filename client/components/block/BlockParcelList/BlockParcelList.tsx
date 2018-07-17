import * as React from "react";

import { SignedParcel, ChangeShardState, Payment, SetRegularKey } from "codechain-sdk/lib/core/classes";

import "./BlockParcelList.scss"
import HexString from "../../util/HexString/HexString";
import { Row, Col } from "reactstrap";

interface Props {
    parcels: SignedParcel[];
}

const ParcelObjectByType = (parcel: SignedParcel) => {
    if (parcel.unsigned.action instanceof Payment) {
        return ([
            <Row key="payment-amount">
                <Col md="2">
                    Amount
            </Col>
                <Col md="10">
                    {parcel.unsigned.action.amount.value.toString()}
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
                                        <HexString link={`/addr-platform/0x${parcel.getSender().value}`} text={parcel.getSender().value} length={15} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="2" className="text-center">
                                >
                            </Col>
                            <Col md="5" className="background-highlight">
                                <Row>
                                    <Col md="5">
                                        Receiver
                                    </Col>
                                    <Col md="7">
                                        <HexString link={`/addr-platform/0x${parcel.unsigned.action.receiver.value}`} text={parcel.unsigned.action.receiver.value} length={15} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>])
    } else if (parcel.unsigned.action instanceof ChangeShardState) {
        return <Row>
            <Col>
                <div className="background-highlight">
                    <Row className="inner-row">
                        <Col md="2">
                            Count of Txs
                        </Col>
                        <Col md="10">
                            {parcel.unsigned.action.transactions.length}
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    } else if (parcel.unsigned.action instanceof SetRegularKey) {
        return <Row>
            <Col md="2">
                Key
            </Col>
            <Col md="10">
                <HexString text={parcel.unsigned.action.key.value} />
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
        const hash = parcel.hash().value;
        return <div key={`block-parcel-${hash}`} className="parcel-item">
            <div className={`type ${getClassNameByType(parcel.unsigned.action.toJSON().action)}`}>
                {parcel.unsigned.action.toJSON().action}
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
                    <HexString link={`/address/0x${parcel.getSender().value}`} text={parcel.getSender().value} />
                </Col>
            </Row>
            <Row>
                <Col md="2">
                    Fee
                </Col>
                <Col md="10">
                    <td>{parcel.unsigned.fee.value.toString()}</td>
                </Col>
            </Row>
            <Row>
                <Col md="2">
                    Timestamp
                </Col>
                <Col md="10">
                    <td>timestamp</td>
                </Col>
            </Row>
            {ParcelObjectByType(parcel)}
        </div>
    })}</div >
};

export default BlockParcelList;
