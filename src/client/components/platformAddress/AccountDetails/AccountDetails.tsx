import * as React from "react";
import { U256 } from "codechain-sdk/lib/core/classes";
import { Row, Col } from "reactstrap";

import "./AccountDetails.scss";

interface OwnProps {
    account: {
        nonce: U256,
        balance: U256,
    },
}

const AccountDetails = (prop: OwnProps) => {
    const { account } = prop;
    return <div className="account-details">
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
                            Balance
                        </Col>
                        <Col md="9">
                            {account.balance.value.toString()}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="3">
                            Nonce
                        </Col>
                        <Col md="9">
                            {account.nonce.value.toString()}
                        </Col>
                    </Row>
                    <hr />
                </div>
            </Col>
        </Row>
    </div>
};

export default AccountDetails;
