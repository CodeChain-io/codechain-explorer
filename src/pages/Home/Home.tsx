import * as _ from "lodash";
import * as React from "react";
import { Container } from "reactstrap";
import LatestBlocks from "../../components/home/LatestBlocks/LatestBlocks";
import LatestParcels from "../../components/home/LatestParcels/LatestParcels";
import LatestTransactions from "../../components/home/LatestTransactions/LatestTransactions";
import { RequestBlock, RequestBlockNumber, RequestBlocks, RequestParcels, RequestTransactions } from "../../request";

import { AssetTransactionGroupDoc, BlockDoc, ParcelDoc, TransactionDoc } from "codechain-es/lib/types";
import { Type } from "codechain-es/lib/utils";
import Summary from "../../components/home/Summary/Summary";
import "./Home.scss";

interface State {
    bestBlockNumber?: number;
    blocks: BlockDoc[];
    parcels: ParcelDoc[];
    transactions: TransactionDoc[];
    requestNewBlock: boolean;
    blockInitialized: boolean;
    parcelInitialized: boolean;
    transactionInitialized: boolean;
}

class Home extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            bestBlockNumber: undefined,
            blocks: [],
            parcels: [],
            transactions: [],
            requestNewBlock: false,
            blockInitialized: false,
            parcelInitialized: false,
            transactionInitialized: false
        };
    }

    public render() {
        const {
            bestBlockNumber,
            requestNewBlock,
            blocks,
            parcels,
            transactions,
            blockInitialized,
            parcelInitialized,
            transactionInitialized
        } = this.state;
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
                {blockInitialized && parcelInitialized && transactionInitialized ? (
                    <RequestBlockNumber repeat={10000} onBlockNumber={this.onBlockNumber} onError={this.onError} />
                ) : null}
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

    private onBlockNumber = (n: number) => {
        if (this.state.blocks[0].number < n) {
            this.setState({ bestBlockNumber: n, requestNewBlock: true });
        }
    };

    private onError = (e: any) => console.log(e);
}

export default Home;
