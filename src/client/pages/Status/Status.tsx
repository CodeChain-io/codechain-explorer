import * as React from "react";
import { Container, Row, Col } from "reactstrap";

import "./Status.scss";
import NodeStatus from "../../components/status/NodeStatus/NodeStatus";
import SyncStatus from "../../components/status/SyncStatus/SyncStatus";
import ChainInfo from "../../components/status/ChainInfo/ChainInfo";
import DifficultyChart from "../../components/status/DifficultyChart/DifficultyChart";
import RequestNodeStatus, { NodeStatusData } from "../../request/RequestNodeStatus";
import RequestSyncStatus, { SyncData } from "../../request/RequestSyncStatus";
import RequestCodeChainStatus, { CodeChainData } from "../../request/RequestCodeChainStatus";
import RequestBlockDifficulty from "../../request/RequestBlockDifficulty";

interface State {
    nodeStatus?: NodeStatusData;
    syncStatus?: SyncData;
    chainInfo?: CodeChainData;
    difficulty?: Array<{
        x: string;
        y: string;
    }>
}

class Status extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            nodeStatus: undefined,
            syncStatus: undefined,
            chainInfo: undefined,
            difficulty: undefined
        }
    }

    public render() {
        const { nodeStatus, syncStatus, chainInfo, difficulty } = this.state;
        return (
            <div className="status">
                <Container>
                    <h1>Status</h1>
                    <Row>
                        <Col lg="6">
                            {
                                nodeStatus ?
                                    <div className="mt-large">
                                        <NodeStatus nodeStatus={nodeStatus} />
                                    </div> : <RequestNodeStatus onNodeStatus={this.onNodeStatus} onError={this.onError} />
                            }
                            {
                                syncStatus ?
                                    <div className="mt-large">
                                        <SyncStatus syncStatus={syncStatus} />
                                    </div> : <RequestSyncStatus onSync={this.onSyncStatus} onError={this.onError} />
                            }
                            {
                                chainInfo ?
                                    <div className="mt-large">
                                        <ChainInfo chainInfo={chainInfo} />
                                    </div> : <RequestCodeChainStatus onCodeChain={this.onChainInfo} onError={this.onError} />
                            }
                        </Col>
                        <Col lg="6">
                            {
                                difficulty ?
                                    <div className="mt-large">
                                        <DifficultyChart difficulty={difficulty} />
                                    </div> : <RequestBlockDifficulty onBlockDifficulty={this.onBlockDifficulty} onError={this.onError} />
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
    private onBlockDifficulty = (difficulty: Array<{ x: string, y: string }>) => {
        this.setState({ difficulty });
    }
    private onNodeStatus = (nodeStatus: NodeStatusData) => {
        this.setState({ nodeStatus });
    }
    private onChainInfo = (chainInfo: CodeChainData) => {
        this.setState({ chainInfo });
    }
    private onSyncStatus = (syncStatus: SyncData) => {
        this.setState({ syncStatus });
    }
    private onError = (error: any) => {
        console.log(error);
    }
}

export default Status;
