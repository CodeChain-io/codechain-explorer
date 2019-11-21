import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as React from "react";
import { Col, Container, Row } from "reactstrap";
import LatestBlocks from "../../components/home/LatestBlocks/LatestBlocks";
import LatestTransactions from "../../components/home/LatestTransactions/LatestTransactions";
import { RequestBlockNumber, RequestBlocks, RequestTransactions } from "../../request";

import { BlockDoc, TransactionDoc } from "codechain-indexer-types";
import { connect } from "react-redux";
import { BlocksResponse } from "src/request/RequestBlocks";
import { TransactionsResponse } from "src/request/RequestTransactions";
import { RootState } from "../../redux/actions";
import BlockCapacityUsageChart from "./BlockCapacityUsageChart";
import BlockCreationTimeChart from "./BlockCreationTimeChart";
import FeeStatusChart from "./FeeStatusChart";
import "./Home.scss";
import TransactionsCountByTypeChart from "./TransactionsCountByTypeChart";

interface State {
    lastBestBlockNumber?: number;
    blocks: BlockDoc[];
    transactions: TransactionDoc[];
    requestBlocks: boolean;
    requestTransactions: boolean;
}

interface StateProps {
    bestBlockNumber?: number;
}

type Props = StateProps;

class Home extends React.Component<Props, State> {
    private refresher: any;
    constructor(props: {}) {
        super(props);
        this.state = {
            lastBestBlockNumber: undefined,
            blocks: [],
            transactions: [],
            requestBlocks: true,
            requestTransactions: true
        };
    }
    public componentWillUnmount() {
        if (this.refresher) {
            clearInterval(this.refresher);
        }
    }
    public componentDidMount() {
        this.refresher = setInterval(this.checkNewBlock, 1000);
        this.checkNewBlock(0);
    }
    public render() {
        const { bestBlockNumber } = this.props;
        if (bestBlockNumber === undefined) {
            return <RequestBlockNumber />;
        }
        const { lastBestBlockNumber, blocks, transactions, requestBlocks, requestTransactions } = this.state;
        return (
            <div className="home animated fadeIn">
                <Container>
                    <div className="home-element-container">
                        <Row>
                            <Col lg="12">
                                <h1>Network Status</h1>
                                <br />
                                <h5>
                                    <span className="text-success mr-3">
                                        <FontAwesomeIcon icon={faCircle} />
                                    </span>
                                    Last Block: {lastBestBlockNumber}
                                </h5>
                                <br />
                                <div className="mb-1">
                                    Average block creation time in last 30 blocks:{" "}
                                    <b>{this.calculateAvgBlockCreationTime()}</b> seconds
                                </div>
                                <div className="mb-3">
                                    Average block size in last 30 blocks: <b>{this.calculateAvgBlockSize()}</b> bytes
                                </div>
                            </Col>
                            <Col lg="6" className="mt-3">
                                <BlockCreationTimeChart blocks={blocks} />
                            </Col>
                            <Col lg="6" className="mt-3">
                                <BlockCapacityUsageChart blocks={blocks} />
                            </Col>
                            <Col lg="6" className="mt-3">
                                <TransactionsCountByTypeChart blocks={blocks} />
                            </Col>
                            <Col lg="6" className="mt-3">
                                <FeeStatusChart onError={this.onError} />
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col lg="6">
                            <div className="home-element-container">
                                <LatestBlocks blocks={blocks} />
                                {requestBlocks && (
                                    <RequestBlocks
                                        itemsPerPage={31}
                                        showProgressBar={false}
                                        onBlocks={this.onBlocks}
                                        onError={this.onError}
                                    />
                                )}
                            </div>
                        </Col>
                        <Col lg="6">
                            <div className="home-element-container">
                                <LatestTransactions transactions={transactions} />
                                {requestTransactions && (
                                    <RequestTransactions
                                        itemsPerPage={10}
                                        showProgressBar={false}
                                        onTransactions={this.onTransactions}
                                        onError={this.onError}
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    private onBlocks = (response: BlocksResponse) => {
        const { data } = response;
        this.setState({ blocks: data, requestBlocks: false });
    };

    private onTransactions = (response: TransactionsResponse) => {
        const { data } = response;
        this.setState({ transactions: data, requestTransactions: false });
    };

    private checkNewBlock = (n: number) => {
        const { bestBlockNumber } = this.props;
        const { lastBestBlockNumber } = this.state;
        if (bestBlockNumber && lastBestBlockNumber && bestBlockNumber > lastBestBlockNumber) {
            this.setState({ requestBlocks: true, requestTransactions: true });
        }
        this.setState({ lastBestBlockNumber: bestBlockNumber });
    };

    private onError = (e: any) => console.log(e);

    private calculateAvgBlockCreationTime = () => {
        const { blocks } = this.state;
        const data =
            blocks.length < 2
                ? [0]
                : _.range(0, blocks.length - 1).map(i => blocks[i].timestamp - blocks[i + 1].timestamp);
        return _.mean(data).toFixed(2);
    };

    private calculateAvgBlockSize = () => {
        const { blocks } = this.state;
        return _.mean(blocks.map(block => block.size)).toFixed(0);
    };
}

export default connect((state: RootState) => ({
    bestBlockNumber: state.appReducer.bestBlockNumber
}))(Home);
