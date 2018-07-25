import * as React from "react";
import { U256 } from "codechain-sdk/lib/core/classes";
import { Row, Col } from "reactstrap";

import "./AccountDetails.scss";
import * as icon from "./img/icon.png";
import * as qr from "./img/qr.png";

interface OwnProps {
    address: string,
    account: {
        nonce: U256,
        balance: U256,
    },
}

const AccountDetails = (prop: OwnProps) => {
    const { account, address } = prop;
    return <div className="account-details">
        <Row>
            <Col md="2">
                <img src={icon} className="icon" />
            </Col>
            <Col md="10">
                <div className="d-flex">
                    <div className="d-inline-block mr-auto d-flex align-items-center">
                        <div>
                            <h4>{address}</h4>
                            <span>Username</span>
                        </div>
                    </div>
                    <div className="d-inline-block">
                        <img src={qr} className="qr" />
                    </div>
                </div>
            </Col>
        </Row>
        <div className="line" />
        <Row>
            <Col md="2">
                Balance
            </Col>
            <Col md="10">
                {account.balance.value.toString()}
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Nonce
            </Col>
            <Col md="10">
                {account.nonce.value.toString()}
            </Col>
        </Row>
    </div>
};

export default AccountDetails;
