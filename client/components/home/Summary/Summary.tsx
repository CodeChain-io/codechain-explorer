import * as React from "react";
import { Row, Col } from 'reactstrap';

import "./Summary.scss";

const Summary = () => {
    return <div className="summary">
        <h1>Summary</h1>
        <Row>
            <Col md="6">
                <div className="chart-container text-center">Summary Chart</div>
            </Col>
            <Col md="6">
                <div className="chart-container text-center">Transaction History Chart</div>
            </Col>
        </Row>
    </div>
};

export default Summary;
