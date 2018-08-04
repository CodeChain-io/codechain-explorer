import * as React from "react";
import { Row, Col } from "reactstrap";

import "./AddressDetails.scss";
import { AssetBundleDoc, TransactionDoc } from "../../../../db/DocType";

interface OwnProps {
    utxo: AssetBundleDoc[];
    transactions: TransactionDoc[];
}

const AddressDetails = (prop: OwnProps) => {
    const { utxo, transactions } = prop;
    return <div className="address-details">
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
        </Row>
    </div>
};

export default AddressDetails;
