import * as React from "react";
import * as _ from "lodash";
import * as FontAwesome from "react-fontawesome";

import { Col, Row } from "reactstrap";

import "./ParcelDetails.scss"
import HexString from "../../util/HexString/HexString";
import { ParcelDoc, Type, PaymentDoc, SetRegularKeyDoc, ChangeShardStateDoc } from "../../../../db/DocType";
import { Link } from "react-router-dom";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";
import { ActionBadge } from "../../util/ActionBadge/ActionBadge";
import { StatusBadge } from "../../util/StatusBadge/StatusBadge";

interface Props {
    parcel: ParcelDoc;
    status: string;
}

const getElementByType = (parcel: ParcelDoc) => {
    if (Type.isPaymentDoc(parcel.action)) {
        return [
            <Row key="parcel-header-table-payment-sender">
                <Col md="3">
                    Sender
                </Col>
                <Col md="9">
                    <Link to={`/addr-platform/${PlatformAddress.fromAccountId(parcel.sender).value}`}>{PlatformAddress.fromAccountId(parcel.sender).value}</Link>
                </Col>
            </Row>,
            <hr key="line1" />,
            <Row key="parcel-header-table-payment-receiver">
                <Col md="3">
                    Receiver
                </Col>
                <Col md="9">
                    <Link to={`/addr-platform/${PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value}`}>{PlatformAddress.fromAccountId((parcel.action as PaymentDoc).receiver).value}</Link>
                </Col>
            </Row>,
            <hr key="line2" />,
            <Row key="parcel-header-table-payment-amount">
                <Col md="3">
                    Amount
                </Col>
                <Col md="9">
                    {(parcel.action as PaymentDoc).amount}
                </Col>
            </Row>,
            <hr key="line3" />
        ];
    } else if (Type.isSetRegularKeyDoc(parcel.action)) {
        return (
            [
                <Row key="parcel-header-table-regular-key">
                    <Col md="3">
                        Key
                    </Col>
                    <Col md="9">
                        <HexString text={(parcel.action as SetRegularKeyDoc).key} />
                    </Col>
                </Row >,
                <hr key="line" />
            ]);
    } else if (Type.isChangeShardStateDoc(parcel.action)) {
        return (
            [
                <Row key="parcel-header-table-change-shard-state-key">
                    <Col md="3">
                        # of Transactions
                    </Col>
                    <Col md="9">
                        {(parcel.action as ChangeShardStateDoc).transactions.length}
                    </Col>
                </Row >,
                <hr key="line" />
            ]);
    }
    return null;
}

const ParcelDetails = (props: Props) => {
    const { parcel, status } = props;

    return <div className="parcel-details">
        <Row>
            <Col lg={Type.isChangeShardStateDoc(parcel.action) ? "9" : "12"}>
                <h2>Details</h2>
                <hr className="heading-hr" />
            </Col>
        </Row>
        <Row>
            <Col lg={Type.isChangeShardStateDoc(parcel.action) ? "9" : "12"}>
                <div className="data-set">
                    <Row>
                        <Col md="3">
                            Action
                        </Col>
                        <Col md="9">
                            <ActionBadge parcel={parcel} />
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="3">
                            Block No.
                        </Col>
                        <Col md="9">
                            <Link to={`/block/${parcel.blockNumber}`}>
                                {parcel.blockNumber}
                            </Link>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="3">
                            Parcel Index
                        </Col>
                        <Col md="9">
                            {parcel.parcelIndex}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="3">
                            Network ID
                        </Col>
                        <Col md="9">
                            {parcel.networkId}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="3">
                            Nonce
                        </Col>
                        <Col md="9">
                            {parcel.nonce}
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
                    <Row>
                        <Col md="3">
                            Status
                        </Col>
                        <Col md="9">
                            <StatusBadge status={status} />
                        </Col>
                    </Row>
                    <hr />
                    {
                        getElementByType(parcel)
                    }
                </div>
            </Col>
            {
                Type.isChangeShardStateDoc(parcel.action) ?
                    <Col lg="3">
                        <div className="right-panel-item mt-3 mt-lg-0">
                            <h2># of Transaction types</h2>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesome className="square asset-transfer-transaction-text-color" name="square" />
                                <span className="mr-auto item-name">Transfer</span>
                                <span>
                                    {_.filter((parcel.action as ChangeShardStateDoc).transactions, (tx) => Type.isAssetTransferTransactionDoc(tx)).length
                                    }</span>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesome className="square asset-mint-transaction-text-color" name="square" />
                                <span className="mr-auto item-name">Mint</span>
                                <span>
                                    {_.filter((parcel.action as ChangeShardStateDoc).transactions, (tx) => Type.isAssetMintTransactionDoc(tx)).length}</span>
                            </div>
                        </div>
                    </Col>
                    : null
            }
        </Row>
    </div>
};

export default ParcelDetails;
