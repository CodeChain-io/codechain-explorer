import * as React from "react";
import { Col, Row } from "reactstrap";
import { Progress } from "reactstrap";

import { Link } from "react-router-dom";
import { SyncData } from "../../../request/RequestSyncStatus";
import DataSet from "../../util/DataSet/DataSet";
import HexString from "../../util/HexString/HexString";
import "./SyncStatus.scss";

interface Props {
    syncStatus: SyncData;
}

class SyncStatus extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { syncStatus } = this.props;
        return (
            <div className="sync-status">
                <div>
                    <h2>Sync Status</h2>
                    <hr className="heading-hr" />
                </div>
                <DataSet isStatus={true}>
                    <div className="one-line-data-set">
                        <div>Best block number (CodeChain)</div>
                        <div>{syncStatus.codechainBestBlockNumber.toLocaleString()}</div>
                    </div>
                    <hr />
                    <Row>
                        <Col md="6">Best block hash (CodeChain)</Col>
                        <Col md="6">
                            0x
                            {syncStatus.codechainBestBlockHash}
                        </Col>
                    </Row>
                    <hr />
                    <div className="one-line-data-set">
                        <div>Last block number (Explorer)</div>
                        <div>
                            <Link to={`/block/${syncStatus.explorerLastBlockNumber}`}>
                                {syncStatus.explorerLastBlockNumber.toLocaleString()}
                            </Link>
                        </div>
                    </div>
                    <hr />
                    <Row>
                        <Col md="6">Last block hash (Explorer)</Col>
                        <Col md="6">
                            <HexString
                                text={syncStatus.explorerLastBlockHash}
                                link={`/block/0x${syncStatus.explorerLastBlockHash}`}
                            />
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="6">Sync progress</Col>
                        <Col md="6">
                            <Progress
                                className="custom-progress"
                                color="success"
                                value={
                                    Math.floor(
                                        (syncStatus.explorerLastBlockNumber / syncStatus.codechainBestBlockNumber) *
                                            1000
                                    ) / 10
                                }
                            />
                            <span className="progress-value">
                                {Math.floor(
                                    (syncStatus.explorerLastBlockNumber / syncStatus.codechainBestBlockNumber) * 1000
                                ) / 10}
                                %
                            </span>
                        </Col>
                    </Row>
                    <hr />
                </DataSet>
            </div>
        );
    }
}

export default SyncStatus;
