import * as React from "react";

import { Col, Row } from "reactstrap";

import "./TransactionSummary.scss"
import { TransactionDoc, Type } from "../../../../db/DocType";

interface Props {
    transaction: TransactionDoc;
}

const TransactionSummary = (props: Props) => {
    if (Type.isAssetTransferTransactionDoc(props.transaction)) {
        return <div className="transaction-summary">
            <Row>
                <Col>
                    <div className="summary-item text-center">
                        <h3>Input</h3>
                        <p>list of input</p>
                    </div>
                </Col>
                <Col>
                    <div className="summary-item text-center">
                        <h3>Output</h3>
                        <p className="my-auto">list of output</p>
                    </div>
                </Col>
            </Row>
        </div>
    } else {
        return <div className="transaction-summary">
            <Row >
                <Col>
                    <div className="summary-item text-center">
                        <h3>Registrar</h3>
                        <p>Registrar hash</p>
                    </div>
                </Col>
                <Col>
                    <div className="summary-item text-center">
                        <h3>Asset</h3>
                        <p>Asset type</p>
                    </div>
                </Col>
            </Row>
        </div>
    }
};

export default TransactionSummary;
