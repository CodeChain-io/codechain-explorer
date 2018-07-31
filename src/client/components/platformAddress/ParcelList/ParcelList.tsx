import * as React from "react";
import * as moment from "moment";

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

const getBadgeClassNameByAction = (action: string) => {
    switch (action) {
        case "changeShardState":
            return "change-shard-state-action-back-color";
        case "payment":
            return "payment-action-back-color";
        case "setRegularKey":
            return "set-regular-key-action-back-color";
    }
    return "";
}

const getActionString = (action: string) => {
    switch (action) {
        case "changeShardState":
            return "ChangeShardState";
        case "payment":
            return "Payment";
        case "setRegularKey":
            return "SetRegularKey";
    }
    return "";
}

const ParcelObjectByType = (parcel: ParcelDoc, address: string) => {
    if (Type.isPaymentDoc(parcel.action)) {
        return (
            [
                <Row key="payment-amount">
                    <Col md="3">
                        Amount
                    </Col>
                    <Col md="9">
                        {(parcel.action as PaymentDoc).amount}
                    </Col>
                </Row>,
                <Row key="payment-sender-receiver">
                    <Col>
                        <Row>
                            <Col md="5">
                                <div className="sender-receiver-container">
                                    {
                                        address === PlatformAddress.fromAccountId(parcel.sender).value ?
                                            `${PlatformAddress.fromAccountId(parcel.sender).value.slice(0, 15)}...`
                                            : <Link to={`/addr-platform/${PlatformAddress.fromAccountId(parcel.sender).value}`}>{PlatformAddress.fromAccountId(parcel.sender).value.slice(0, 15)}...</Link>
                                    }
                                </div>
                            </Col>
                            <Col md="2" className="text-center">
                                <img src={arrow} alt="arrow" />
                            </Col>
                            <Col md="5">
                                <div className="sender-receiver-container">
                                    {
                                        address === PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value ?
                                            `${PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value.slice(0, 15)}...`
                                            : <Link to={`/addr-platform/${PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value}`}>{PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value.slice(0, 15)}...</Link>
                                    }                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ]
        )
    } else if (Type.isChangeShardStateDoc(parcel.action)) {
        return <Row>
            <Col md="3">
                # of Txs
            </Col>
            <Col md="9">
                {(parcel.action as ChangeShardStateDoc).transactions.length}
            </Col>
        </Row>
    } else if (Type.isSetRegularKeyDoc(parcel.action)) {
        return <Row>
            <Col md="3">
                Key
            </Col>
            <Col md="9">
                <HexString text={(parcel.action as SetRegularKeyDoc).key} />
            </Col>
        </Row>
    }
    return null;
}

const ParcelList = (props: Props) => {
    const { parcels, address } = props;
    return <div className="parcel-list mt-4">
        <Row className="mb-3">
            <Col>
                <h2>Parcels</h2>
                <hr className="heading-hr" />
            </Col>
        </Row>
        <Row>
            <Col>
                {
                    parcels.map((parcel, i: number) => {
                        const hash = parcel.hash;
                        return <div key={`block-parcel-${hash}`} className="card-list-item mb-3">
                            <div className="card-list-item-header">
                                <Row>
                                    <Col md="3">
                                        <span className="title">#{i}</span>
                                    </Col>
                                    <Col md="9">
                                        <span className="timestamp float-right">{moment.unix(parcel.timestamp).format("YYYY-MM-DD HH:mm:ssZ")}</span>
                                    </Col>
                                </Row>
                            </div>
                            <div className="card-list-item-body data-set">
                                <Row>
                                    <Col md="3">
                                        Action
                                    </Col>
                                    <Col md="9">
                                        <span className={`type-badge ${getBadgeClassNameByAction(parcel.action.action)}`}>{getActionString(parcel.action.action)}</span>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">
                                        Hash
                                    </Col>
                                    <Col md="9">
                                        <HexString link={`/parcel/0x${hash}`} text={hash} />
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">
                                        Signer
                                    </Col>
                                    <Col md="9">
                                        <Link to={`/addr-platform/${PlatformAddress.fromAccountId(parcel.sender).value}`}>{PlatformAddress.fromAccountId(parcel.sender).value}</Link>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">
                                        Fee
                                    </Col>
                                    <Col md="9">
                                        {parcel.fee}
                                    </Col>
                                </Row>
                                <hr />
                                {ParcelObjectByType(parcel, address)}
                            </div>
                        </div>
                    })
                }
            </Col>
        </Row>
    </div >
};

export default ParcelList;
