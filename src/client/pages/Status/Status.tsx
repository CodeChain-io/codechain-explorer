import * as React from "react";
import { Container, Row, Col } from "reactstrap";

import "./Status.scss";
import NodeStatus from "../../components/status/NodeStatus/NodeStatus";
import SyncStatus from "../../components/status/SyncStatus/SyncStatus";
import ChainInfo from "../../components/status/ChainInfo/ChainInfo";
import DifficultyChart from "../../components/status/DifficultyChart/DifficultyChart";

class Status extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render() {
        return (
            <div className="status">
                <Container>
                    <h1>Status</h1>
                    <Row>
                        <Col lg="6">
                            <div className="mt-large">
                                <NodeStatus />
                            </div>
                            <div className="mt-large">
                                <SyncStatus />
                            </div>
                            <div className="mt-large">
                                <ChainInfo />
                            </div>
                        </Col>
                        <Col lg="6">
                            <div className="mt-large">
                                <DifficultyChart />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Status;
