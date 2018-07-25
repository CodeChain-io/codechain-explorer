import * as React from 'react';
import * as _ from "lodash";
import { RequestBlockNumber, RequestBlock } from '../../request';
import { Container } from 'reactstrap';
import LatestBlocks from '../../components/home/LatestBlocks/LatestBlocks';
import LatestParcels from '../../components/home/LatestParcels/LatestParcels';
import LatestTransactions from '../../components/home/LatestTransactions/LatestTransactions';

import "./Home.scss"
import Summary from '../../components/home/Summary/Summary';
import { BlockDoc } from '../../../db/DocType';

interface State {
    bestBlockNumber?: number;
    blocksByNumber: {
        [n: number]: BlockDoc;
    }
}

class Home extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            blocksByNumber: {}
        };
    }

    public render() {
        const { bestBlockNumber, blocksByNumber } = this.state;
        if (bestBlockNumber === undefined) {
            return (
                <RequestBlockNumber
                    onBlockNumber={this.onBlockNumber}
                    onError={this.onError} />
            );
        }
        return (
            <div className="home">
                <Container>
                    <div className="home-element-container">
                        <Summary />
                    </div>
                    <div className="home-element-container">
                        <LatestBlocks blocksByNumber={blocksByNumber} />
                    </div>
                    <div className="home-element-container">
                        <LatestParcels blocksByNumber={blocksByNumber} />
                    </div>
                    <div className="home-element-container">
                        <LatestTransactions blocksByNumber={blocksByNumber} />
                    </div>
                    {/* Reqest blocks */}
                    {_.map(_.reverse(_.range(Math.max(0, (bestBlockNumber + 1) - 10), bestBlockNumber + 1)), n => {
                        return <RequestBlock key={'request-block-num-' + n} id={n} onBlock={this.onBlock} onError={this.onError} />
                    })}
                </Container>
                <RequestBlockNumber
                    repeat={1000}
                    onBlockNumber={this.onBlockNumber}
                    onError={this.onError} />
            </div>
        );
    }

    private onBlock = (block: BlockDoc) => {
        const blocksByNumber = {
            ...this.state.blocksByNumber,
            [block.number]: block
        }
        this.setState({
            ...this.state,
            blocksByNumber
        });
    }

    private onBlockNumber = (n: number) => {
        this.setState({ ...this.state, bestBlockNumber: n });
    }

    private onError = (e: any) => (console.log(e))
}

export default Home;
