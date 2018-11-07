import * as _ from "lodash";
import * as React from "react";
import { Container } from "reactstrap";
import LatestBlocks from "../../components/home/LatestBlocks/LatestBlocks";
import LatestParcels from "../../components/home/LatestParcels/LatestParcels";
import LatestTransactions from "../../components/home/LatestTransactions/LatestTransactions";
import { RequestBlock, RequestBlocks, RequestParcels, RequestTransactions } from "../../request";

import { AssetTransactionGroupDoc, BlockDoc, ParcelDoc, TransactionDoc } from "codechain-indexer-types/lib/types";
import { Type } from "codechain-indexer-types/lib/utils";
import { connect } from "react-redux";
import Summary from "../../components/home/Summary/Summary";
import { RootState } from "../../redux/actions";
import "./Home.scss";

interface State {
    lastBestBlockNumber?: number;
    blocks: BlockDoc[];
    parcels: ParcelDoc[];
    transactions: TransactionDoc[];
    requestNewBlock: boolean;
    blockInitialized: boolean;
    parcelInitialized: boolean;
    transactionInitialized: boolean;
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
            requestNewBlock: false,
            blockInitialized: false,
            parcelInitialized: false,
            transactionInitialized: false
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
        const { bestBlockNumber } = this.props;
        const { requestNewBlock, blocks, parcels, transactions } = this.state;
        return (
            <div className="home">
                <Container>
                    <div className="home-element-container">
                        <Summary />
                    </div>
                    <div className="home-element-container">
                        <LatestBlocks blocks={blocks} />
                        <RequestBlocks page={1} itemsPerPage={10} onBlocks={this.onBlocks} onError={this.onError} />
                    </div>
                    <div className="home-element-container">
                        <LatestParcels parcels={parcels} />
                        <RequestParcels page={1} itemsPerPage={10} onParcels={this.onParcels} onError={this.onError} />
                    </div>
                    <div className="home-element-container">
                        <LatestTransactions transactions={transactions} />
                        <RequestTransactions
                            page={1}
                            itemsPerPage={10}
                            onTransactions={this.onTransactions}
                            onError={this.onError}
                        />
                    </div>
                    {requestNewBlock && bestBlockNumber ? (
                        <RequestBlock
                            id={bestBlockNumber}
                            onBlock={this.onBlock}
                            onError={this.onError}
                            onBlockNotExist={this.onBlockNotExist}
                        />
                    ) : null}
                </Container>
            </div>
        );
    }

    private onBlocks = (blocks: BlockDoc[]) => {
        this.setState({ blocks, blockInitialized: true });
    };

    private onParcels = (parcels: ParcelDoc[]) => {
        this.setState({ parcels, parcelInitialized: true });
    };

    private onTransactions = (transactions: TransactionDoc[]) => {
        this.setState({ transactions, transactionInitialized: true });
    };
    private onBlock = (block: BlockDoc) => {
        this.setState({
            blocks: [block, ...this.state.blocks],
            requestNewBlock: false
        });
        if (block.parcels.length > 0) {
            this.setState({
                parcels: _.concat(_.reverse(block.parcels), this.state.parcels)
            });
        }
        const transactions = _.chain(block.parcels)
            .filter(parcel => Type.isAssetTransactionGroupDoc(parcel.action))
            .flatMap(parcel => (parcel.action as AssetTransactionGroupDoc).transactions)
            .value();
        if (transactions.length > 0) {
            this.setState({
                transactions: _.concat(_.reverse(transactions), this.state.transactions)
            });
        }
    };

    private onBlockNotExist = () => {
        // TODO
    };

    private checkNewBlock = (n: number) => {
        const { bestBlockNumber } = this.props;
        const { lastBestBlockNumber } = this.state;
        if (bestBlockNumber && lastBestBlockNumber && bestBlockNumber > lastBestBlockNumber) {
            this.setState({ requestNewBlock: true });
        }
        this.setState({ lastBestBlockNumber: bestBlockNumber });
    };

    private onError = (e: any) => console.log(e);
}

export default connect((state: RootState) => ({ bestBlockNumber: state.appReducer.bestBlockNumber }))(Home);
