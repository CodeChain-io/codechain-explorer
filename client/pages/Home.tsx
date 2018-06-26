import * as React from 'react';
import * as _ from "lodash";
import { RequestBlockNumber, RequestBlock } from '../components/api_request';
import { Link } from 'react-router-dom';
import PendingParcelList from '../components/PendingParcelList';
import { Block } from 'codechain-sdk';

interface State {
    bestBlockNumber?: number;
    blocksByNumber: {
        [n: number]: Block;
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
                <div>
                    Loading ...
                    <RequestBlockNumber
                        repeat={1000}
                        onBlockNumber={this.onBlockNumber}
                        onError={this.onError}/>
                </div>
            );
        }
        return (
            <div>
                <div>Current Block Number: {bestBlockNumber}</div>
                {_.map(_.reverse(_.range(1, bestBlockNumber + 1)), n => {
                    return (
                        <div key={`home-block-num-${n}`}>
                            <hr />
                            <h3><Link to={`/block/${n}`}>Block {n}</Link></h3>
                            {blocksByNumber[n]
                                ? (
                                    <div>
                                        <div>Hash: {blocksByNumber[n].hash.value}</div>
                                        <div>Author: {blocksByNumber[n].author.value}</div>
                                        <div>Total {blocksByNumber[n].parcels.length} Parcels</div>
                                    </div>
                                )
                                : <RequestBlock id={n} onBlock={this.onBlock} onError={this.onError} />
                            }
                        </div>
                    );
                })}
                <hr />
                <PendingParcelList />
            </div>
        );
    }

    private onBlock = (block: Block) => {
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

    private onError = () => ({/* Not implemented */})
}

export default Home;
