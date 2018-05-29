import * as React from 'react';
import * as _ from "lodash";
import { connect } from 'react-redux';
import { RootState } from '../redux/actions';
import { RequestBlockNumber, RequestBlock } from '../components/api_request';
import { Link } from 'react-router-dom';
import PendingParcelList from '../components/PendingParcelList';
import { Block } from 'codechain-sdk/lib/primitives';

interface StateProps {
    blocksByNumber: {
        [n: number]: Block;
    };
}

interface State {
    bestBlockNumber?: number;
}

class HomeInternal extends React.Component<StateProps, State> {
    constructor(props: StateProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const { blocksByNumber } = this.props;
        const { bestBlockNumber } = this.state;
        if (bestBlockNumber === undefined) {
            return (
                <div>
                    Loading ...
                    <RequestBlockNumber
                        onFinish={this.onBestBlockNumber} />
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
                                : <RequestBlock id={n} />
                            }
                        </div>
                    );
                })}
                <hr />
                <PendingParcelList />
            </div>
        );
    }

    private onBestBlockNumber = (n: number) => {
        this.setState({ ...this.state, bestBlockNumber: n });
    }
}

const Home = connect((state: RootState) => {
    return {
        blocksByNumber: state.blocksByNumber
    } as StateProps;
})(HomeInternal);

export default Home;
