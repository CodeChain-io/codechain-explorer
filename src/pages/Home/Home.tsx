import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { Col, Container, Row } from "reactstrap";
import LatestBlocks from "../../components/home/LatestBlocks/LatestBlocks";
import LatestTransactions from "../../components/home/LatestTransactions/LatestTransactions";
import { RequestBlocks, RequestTransactions } from "../../request";

import { BlockDoc, TransactionDoc } from "codechain-indexer-types";
import { connect } from "react-redux";
import RequestServerTime from "src/request/RequestServerTime";
import { RootState } from "../../redux/actions";
import BlockCapacityUsageChart from "./BlockCapacityUsageChart";
import BlockCreationTimeChart from "./BlockCreationTimeChart";
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
    serverTimeOffset?: number;
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
        this.refresher = setInterval(this.checkNewBlock, 5000);
        this.checkNewBlock(0);
    }
    public render() {
        const { serverTimeOffset } = this.props;
        if (serverTimeOffset === undefined) {
            return <RequestServerTime />;
        }
        const { lastBestBlockNumber, blocks, transactions, requestBlocks, requestTransactions } = this.state;
        return (
            <div className="home animated fadeIn">
                <Container>
                    <div className="home-element-container">
                        <Row>
                            <Col lg="6">
                                <h1>Network status</h1>
                                <div>
                                    Block number: {lastBestBlockNumber} (
                                    {blocks.length > 0 &&
                                        moment
                                            .unix(blocks[0].timestamp)
                                            .add(serverTimeOffset, "seconds")
                                            .fromNow()}
                                    )
                                </div>
                                <div>Average block creation time: {this.calculateAvgBlockCreationTime()} seconds</div>
                            </Col>
                            <Col lg="6">
                                <BlockCreationTimeChart blocks={blocks} />
                            </Col>
                            <Col lg="6" className="mt-3">
                                <BlockCapacityUsageChart blocks={blocks} />
                            </Col>
                            <Col lg="6" className="mt-3">
                                <TransactionsCountByTypeChart blocks={blocks} />
                            </Col>
                        </Row>
                    </div>
                    <div className="home-element-container">
                        <LatestBlocks blocks={blocks} />
                        {requestBlocks && (
                            <RequestBlocks page={1} itemsPerPage={31} onBlocks={this.onBlocks} onError={this.onError} />
                        )}
                    </div>
                    <div className="home-element-container">
                        <LatestTransactions transactions={transactions} />
                        {requestTransactions && (
                            <RequestTransactions
                                page={1}
                                itemsPerPage={10}
                                onTransactions={this.onTransactions}
                                onError={this.onError}
                            />
                        )}
                    </div>
                </Container>
            </div>
        );
    }

    private onBlocks = (blocks: BlockDoc[]) => {
        this.setState({ blocks, requestBlocks: false });
    };

    private onTransactions = (transactions: TransactionDoc[]) => {
        this.setState({ transactions, requestTransactions: false });
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
}

export default connect((state: RootState) => ({
    bestBlockNumber: state.appReducer.bestBlockNumber,
    serverTimeOffset: state.appReducer.serverTimeOffset
}))(Home);
