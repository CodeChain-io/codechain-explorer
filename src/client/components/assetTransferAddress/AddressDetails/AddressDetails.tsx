import * as React from "react";
import { Row, Col } from "reactstrap";

import "./AddressDetails.scss";

interface OwnProps {
    totalTransactionCount: number;
}

const AddressDetails = (prop: OwnProps) => {
    const { totalTransactionCount } = prop;
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
                            # of Transactions
                        </Col>
                        <Col md="9">
                            {totalTransactionCount.toLocaleString()}
                        </Col>
                    </Row>
                    <hr />
                </div>
            </Col>
        </Row>
    </div>
};

export default AddressDetails;
