import * as React from "react";
import { Row, Col } from "reactstrap";
import { Progress } from 'reactstrap';

import "./SyncStatus.scss";

class SyncStatus extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render() {
        return (
            <div className="sync-status">
                <div>
                    <h2>Sync Status</h2>
                    <hr className="heading-hr" />
                </div>
                <div className="data-set-for-status">
                    <div className="one-line-data-set">
                        <div>
                            Best block number (CodeChain)
                        </div>
                        <div>
                            2541
                        </div>
                    </div>
                    <hr />
                    <div className="one-line-data-set">
                        <div>
                            Last block hash (Explorer)
                        </div>
                        <div>
                            2541
                        </div>
                    </div>
                    <hr />
                    <div className="one-line-data-set">
                        <div>
                            Last block number (Explorer)
                        </div>
                        <div>
                            2541
                        </div>
                    </div>
                    <hr />
                    <div className="one-line-data-set">
                        <div>
                            Last block hash (Explorer)
                        </div>
                        <div>
                            2541
                        </div>
                    </div>
                    <hr />
                    <Row>
                        <Col md="6">
                            Sync progress
                        </Col>
                        <Col md="6">
                            <Progress className="custom-progress" color="success" value="25" />
                            <span className="progress-value">100%</span>
                        </Col>
                    </Row>
                    <hr />
                </div>
            </div>
        )
    }
};

export default SyncStatus;
