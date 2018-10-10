import { U256 } from "codechain-sdk/lib/core/classes";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { CommaNumberString } from "../../util/CommaNumberString/CommaNumberString";
import DataSet from "../../util/DataSet/DataSet";
import "./AccountDetails.scss";

interface OwnProps {
    account: {
        nonce: U256;
        balance: U256;
    };
}

const AccountDetails = (prop: OwnProps) => {
    const { account } = prop;
    return (
        <div className="account-details">
            <Row>
                <Col>
                    <h2>Details</h2>
                    <hr className="heading-hr" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <DataSet>
                        <Row>
                            <Col md="3">Balance</Col>
                            <Col md="9">
                                <CommaNumberString text={account.balance.value.div(Math.pow(10, 9)).toString(10)} />
                                CCC
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">Nonce</Col>
                            <Col md="9">
                                <CommaNumberString text={account.nonce.value.toString()} />
                            </Col>
                        </Row>
                        <hr />
                    </DataSet>
                </Col>
            </Row>
        </div>
    );
};

export default AccountDetails;
