import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import ExplorerInfo from "src/components/status/ExplorerInfo/ExplorerInfo";
import ChainInfo from "../../components/status/ChainInfo/ChainInfo";
import NodeStatus from "../../components/status/NodeStatus/NodeStatus";
import SyncStatus from "../../components/status/SyncStatus/SyncStatus";
import TransactionChart from "../../components/status/TransactionChart/TransactionChart";
import RequestBlockTransactions from "../../request/RequestBlockDifficulty";
import RequestCodeChainStatus, { CodeChainData } from "../../request/RequestCodeChainStatus";
import RequestNodeStatus from "../../request/RequestNodeStatus";
import RequestSyncStatus, { SyncData } from "../../request/RequestSyncStatus";
import "./Status.scss";

interface State {
    nodeStatus?: boolean;
    syncStatus?: SyncData;
    chainInfo?: CodeChainData;
    transactions?: Array<{
        x: string;
        y: string;
    }>;
    requestNodeStatus: boolean;
    requestSyncStatus: boolean;
    requestChainInfo: boolean;
    requestTransactions: boolean;
}

class Status extends React.Component<{}, State> {
    private interval: NodeJS.Timer;
    constructor(props: {}) {
        super(props);
        this.state = {
            nodeStatus: undefined,
            syncStatus: undefined,
            chainInfo: undefined,
            transactions: undefined,
            requestNodeStatus: true,
            requestSyncStatus: true,
            requestTransactions: true,
            requestChainInfo: true
        };
    }

    public componentDidMount() {
        this.interval = setInterval(() => {
            if (this.state.nodeStatus != null) {
                this.setState({ requestNodeStatus: true });
            }
            if (this.state.syncStatus) {
                this.setState({ requestSyncStatus: true });
            }
            if (this.state.chainInfo) {
                this.setState({ requestChainInfo: true });
            }
            if (this.state.transactions) {
                this.setState({ requestTransactions: true });
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
            transactions,
            requestNodeStatus,
            requestSyncStatus,
            requestChainInfo,
            requestTransactions
        } = this.state;
        return (
            <div className="status animated fadeIn">
                <Container>
                    <h1>Status</h1>
                    <Row>
                        <Col lg="6">
                            {nodeStatus != null ? (
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
                            <div className="mt-large">
                                <ExplorerInfo />
                            </div>
                        </Col>
                        <Col lg="6">
                            {transactions ? (
                                <div className="mt-large">
                                    <TransactionChart transactions={transactions} />
                                </div>
                            ) : null}
                            {requestTransactions ? (
                                <RequestBlockTransactions
                                    onBlockTransactions={this.onTransactions}
                                    onError={this.onError}
                                />
                            ) : null}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
    private onTransactions = (transactions: Array<{ x: string; y: string }>) => {
        this.setState({ transactions, requestTransactions: false });
    };
    private onNodeStatus = (nodeStatus: boolean) => {
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
