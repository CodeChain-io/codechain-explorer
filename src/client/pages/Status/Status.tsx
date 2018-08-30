import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import ChainInfo from "../../components/status/ChainInfo/ChainInfo";
import DifficultyChart from "../../components/status/DifficultyChart/DifficultyChart";
import NodeStatus from "../../components/status/NodeStatus/NodeStatus";
import SyncStatus from "../../components/status/SyncStatus/SyncStatus";
import RequestBlockDifficulty from "../../request/RequestBlockDifficulty";
import RequestCodeChainStatus, { CodeChainData } from "../../request/RequestCodeChainStatus";
import RequestNodeStatus, { NodeStatusData } from "../../request/RequestNodeStatus";
import RequestSyncStatus, { SyncData } from "../../request/RequestSyncStatus";
import "./Status.scss";

interface State {
    nodeStatus?: NodeStatusData;
    syncStatus?: SyncData;
    chainInfo?: CodeChainData;
    difficulty?: Array<{
        x: string;
        y: string;
    }>;
    requestNodeStatus: boolean;
    requestSyncStatus: boolean;
    requestChainInfo: boolean;
    requestDifficulty: boolean;
}

class Status extends React.Component<{}, State> {
    private interval: NodeJS.Timer;
    constructor(props: {}) {
        super(props);
        this.state = {
            nodeStatus: undefined,
            syncStatus: undefined,
            chainInfo: undefined,
            difficulty: undefined,
            requestNodeStatus: true,
            requestSyncStatus: true,
            requestDifficulty: true,
            requestChainInfo: true
        };
    }

    public componentDidMount() {
        this.interval = setInterval(() => {
            if (this.state.nodeStatus) {
                this.setState({ requestNodeStatus: true });
            }
            if (this.state.syncStatus) {
                this.setState({ requestSyncStatus: true });
            }
            if (this.state.chainInfo) {
                this.setState({ requestChainInfo: true });
            }
            if (this.state.difficulty) {
                this.setState({ requestDifficulty: true });
            }
        }, 10000);
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    public render() {
        const {
            nodeStatus,
            syncStatus,
            chainInfo,
            difficulty,
            requestNodeStatus,
            requestSyncStatus,
            requestChainInfo,
            requestDifficulty
        } = this.state;
        return (
            <div className="status">
                <Container>
                    <h1>Status</h1>
                    <Row>
                        <Col lg="6">
                            {nodeStatus ? (
                                <div className="mt-large">
                                    <NodeStatus nodeStatus={nodeStatus} />
                                </div>
                            ) : null}
                            {requestNodeStatus ? (
                                <RequestNodeStatus onNodeStatus={this.onNodeStatus} onError={this.onError} />
                            ) : null}
                            {syncStatus ? (
                                <div className="mt-large">
                                    <SyncStatus syncStatus={syncStatus} />
                                </div>
                            ) : null}
                            {requestSyncStatus ? (
                                <RequestSyncStatus onSync={this.onSyncStatus} onError={this.onError} />
                            ) : null}
                            {chainInfo ? (
                                <div className="mt-large">
                                    <ChainInfo chainInfo={chainInfo} />
                                </div>
                            ) : null}
                            {requestChainInfo ? (
                                <RequestCodeChainStatus onCodeChain={this.onChainInfo} onError={this.onError} />
                            ) : null}
                        </Col>
                        <Col lg="6">
                            {difficulty ? (
                                <div className="mt-large">
                                    <DifficultyChart difficulty={difficulty} />
                                </div>
                            ) : null}
                            {requestDifficulty ? (
                                <RequestBlockDifficulty
                                    onBlockDifficulty={this.onBlockDifficulty}
                                    onError={this.onError}
                                />
                            ) : null}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
    private onBlockDifficulty = (difficulty: Array<{ x: string; y: string }>) => {
        this.setState({ difficulty, requestDifficulty: false });
    };
    private onNodeStatus = (nodeStatus: NodeStatusData) => {
        this.setState({ nodeStatus, requestNodeStatus: false });
    };
    private onChainInfo = (chainInfo: CodeChainData) => {
        this.setState({ chainInfo, requestChainInfo: false });
    };
    private onSyncStatus = (syncStatus: SyncData) => {
        this.setState({ syncStatus, requestSyncStatus: false });
    };
    private onError = (error: any) => {
        console.log(error);
    };
}

export default Status;
