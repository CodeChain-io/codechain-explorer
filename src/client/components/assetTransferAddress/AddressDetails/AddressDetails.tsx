import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import * as _ from "lodash";
import { Row, Col } from "reactstrap";

import "./AddressDetails.scss";
import { AssetBundleDoc, TransactionDoc, Type } from "../../../../db/DocType";

interface OwnProps {
    utxo: AssetBundleDoc[];
    transactions: TransactionDoc[];
}

const AddressDetails = (prop: OwnProps) => {
    const { utxo, transactions } = prop;
    return <div className="address-details">
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
                            Name
                        </Col>
                        <Col md="9">
                            Not implemented
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="3">
                            # of Assets
                        </Col>
                        <Col md="9">
                            {utxo.length}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="3">
                            # of Transactions
                        </Col>
                        <Col md="9">
                            {transactions.length}
                        </Col>
                    </Row>
                    <hr />
                </div>
            </Col>
            <Col lg="3">
                <div className="right-panel-item">
                    <h2># of Transaction types</h2>
                    <hr />
                    <div className="d-flex align-items-center">
                        <FontAwesome className="square asset-transfer-transaction-text-color" name="square" />
                        <span className="mr-auto item-name">Transfer</span>
                        <span>
                            {_.filter(transactions, (tx) => Type.isAssetTransferTransactionDoc(tx)).length
                            }</span>
                    </div>
                    <hr />
                    <div className="d-flex align-items-center">
                        <FontAwesome className="square asset-mint-transaction-text-color" name="square" />
                        <span className="mr-auto item-name">Mint</span>
                        <span>
                            {_.filter(transactions, (tx) => Type.isAssetMintTransactionDoc(tx)).length}</span>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
};

export default AddressDetails;
