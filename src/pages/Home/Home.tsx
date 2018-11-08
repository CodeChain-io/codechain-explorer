import * as _ from "lodash";
import * as React from "react";
import { Container } from "reactstrap";
import LatestBlocks from "../../components/home/LatestBlocks/LatestBlocks";
import LatestParcels from "../../components/home/LatestParcels/LatestParcels";
import LatestTransactions from "../../components/home/LatestTransactions/LatestTransactions";
import { RequestBlocks, RequestParcels, RequestTransactions } from "../../request";

import { BlockDoc, ParcelDoc, TransactionDoc } from "codechain-indexer-types/lib/types";
import { connect } from "react-redux";
import Summary from "../../components/home/Summary/Summary";
import { RootState } from "../../redux/actions";
import "./Home.scss";

interface State {
    lastBestBlockNumber?: number;
    blocks: BlockDoc[];
    parcels: ParcelDoc[];
    transactions: TransactionDoc[];
    requestBlocks: boolean;
    requestParcels: boolean;
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
            parcels: [],
            transactions: [],
            requestBlocks: true,
            requestParcels: true,
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
    }
    public render() {
        const { blocks, parcels, transactions, requestBlocks, requestParcels, requestTransactions } = this.state;
        return (
            <div className="home animated fadeIn">
                <Container>
                    <div className="home-element-container">
                        <Summary />
                    </div>
                    <div className="home-element-container">
                        <LatestBlocks blocks={blocks} />
                        {requestBlocks && (
                            <RequestBlocks page={1} itemsPerPage={10} onBlocks={this.onBlocks} onError={this.onError} />
                        )}
                    </div>
                    <div className="home-element-container">
                        <LatestParcels parcels={parcels} />
                        {requestParcels && (
                            <RequestParcels
                                page={1}
                                itemsPerPage={10}
                                onParcels={this.onParcels}
                                onError={this.onError}
                            />
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

    private onParcels = (parcels: ParcelDoc[]) => {
        this.setState({ parcels, requestParcels: false });
    };

    private onTransactions = (transactions: TransactionDoc[]) => {
        this.setState({ transactions, requestTransactions: false });
    };

    private checkNewBlock = (n: number) => {
        const { bestBlockNumber } = this.props;
        const { lastBestBlockNumber } = this.state;
        if (bestBlockNumber && lastBestBlockNumber && bestBlockNumber > lastBestBlockNumber) {
            this.setState({ requestBlocks: true, requestParcels: true, requestTransactions: true });
        }
        this.setState({ lastBestBlockNumber: bestBlockNumber });
    };

    private onError = (e: any) => console.log(e);
}

export default connect((state: RootState) => ({ bestBlockNumber: state.appReducer.bestBlockNumber }))(Home);
