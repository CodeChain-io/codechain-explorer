import * as React from "react";
import * as _ from "lodash";
import * as FontAwesome from "react-fontawesome";

import { Col, Row } from "reactstrap";

import "./BlockDetails.scss"
import HexString from "../../util/HexString/HexString";
import { BlockDoc, Type, ChangeShardStateDoc } from "../../../../db/DocType";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";
import { Link } from "react-router-dom";

interface OwnProps {
    block: BlockDoc;
}

class BlockDetails extends React.Component<OwnProps> {
    public render() {
        const { block } = this.props;
        return (
            <div className="block-details mb-4">
                <Row>
                    <Col lg="9">
                        <h2>Details</h2>
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                <Row>
                    <Col lg="9" className="mb-3 mb-lg-0">
                        <div className="data-set">
                            <Row>
                                <Col md="3">
                                    Parent Block Hash
                                </Col>
                                <Col md="9">
                                    <HexString link={`/block/0x${block.parentHash}`} text={block.parentHash} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Parcels Root
                                </Col>
                                <Col md="9">
                                    <HexString text={block.parcelsRoot} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Invoices Root
                                </Col>
                                <Col md="9">
                                    <HexString text={block.invoicesRoot} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    State Root
                                </Col>
                                <Col md="9">
                                    <HexString text={block.stateRoot} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Author
                                </Col>
                                <Col md="9">
                                    <Link to={`/addr-platform/${PlatformAddress.fromAccountId(block.author).value}`}>{PlatformAddress.fromAccountId(block.author).value}</Link>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Score
                                </Col>
                                <Col md="9">
                                    {block.score}
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Seal
                                </Col>
                                <Col md="9">
                                    <div className="text-area">
                                        {block.seal}
                                    </div>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Extra Data
                                </Col>
                                <Col md="9">
                                    <div className="text-area">
                                        {block.extraData}
                                    </div>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    # of Parcels
                                </Col>
                                <Col md="9">
                                    {block.parcels.length}
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    # of Transactions
                                </Col>
                                <Col md="9">
                                    {_.reduce(block.parcels, (memo, parcel) => {
                                        if (Type.isChangeShardStateDoc(parcel.action)) {
                                            return (parcel.action as ChangeShardStateDoc).transactions.length + memo;
                                        } else {
                                            return memo;
                                        }
                                    }, 0)}
                                </Col>
                            </Row>
                            <hr />
                        </div>
                    </Col>
                    <Col lg="3">
                        <div className="right-panel-item mb-3">
                            <h2># of Parcel types</h2>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesome className="square payment-action-text-color" name="square" />
                                <span className="mr-auto item-name">Payment</span>
                                <span>{_.filter(block.parcels, (parcel) => Type.isPaymentDoc(parcel.action)).length}</span>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesome className="square change-shard-state-action-text-color" name="square" />
                                <span className="mr-auto item-name">ChangeShardState</span>
                                <span>{_.filter(block.parcels, (parcel) => Type.isChangeShardStateDoc(parcel.action)).length}</span>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesome className="square set-regular-key-action-text-color" name="square" />
                                <span className="mr-auto item-name">SetRegularKey</span>
                                <span>{_.filter(block.parcels, (parcel) => Type.isSetRegularKeyDoc(parcel.action)).length}</span>
                            </div>
                        </div>
                        <div className="right-panel-item">
                            <h2># of Transaction types</h2>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesome className="square asset-transfer-transaction-text-color" name="square" />
                                <span className="mr-auto item-name">Transfer</span>
                                <span>
                                    {_.reduce(block.parcels, (memo, parcel) => {
                                        if (Type.isChangeShardStateDoc(parcel.action)) {
                                            const transactions = (parcel.action as ChangeShardStateDoc).transactions;
                                            const assetTransferTransaction = _.filter(transactions, (tx) => Type.isAssetTransferTransactionDoc(tx)).length;
                                            return assetTransferTransaction + memo;
                                        } else {
                                            return memo;
                                        }
                                    }, 0)}</span>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesome className="square asset-mint-transaction-text-color" name="square" />
                                <span className="mr-auto item-name">Mint</span>
                                <span>
                                    {_.reduce(block.parcels, (memo, parcel) => {
                                        if (Type.isChangeShardStateDoc(parcel.action)) {
                                            const transactions = (parcel.action as ChangeShardStateDoc).transactions;
                                            const assetTransferTransaction = _.filter(transactions, (tx) => Type.isAssetMintTransactionDoc(tx)).length;
                                            return assetTransferTransaction + memo;
                                        } else {
                                            return memo;
                                        }
                                    }, 0)}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default BlockDetails;
