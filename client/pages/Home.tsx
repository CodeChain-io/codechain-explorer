import * as React from 'react';
import * as _ from "lodash";
import { connect } from 'react-redux';
import { RootState } from '../redux/actions';
import { RequestBlockNumber, RequestBlock } from '../components/requests';
import { Link } from 'react-router-dom';
import PendingParcelList from '../components/PendingParcelList';
import { Block } from 'codechain-sdk/lib/primitives';

interface StateProps {
    bestBlockNumber?: number;
    blocksByNumber: {
        [n: number]: Block;
    };
}

class HomeInternal extends React.Component<StateProps> {
    public render() {
        const { bestBlockNumber, blocksByNumber } = this.props;
        if (bestBlockNumber === undefined) {
            return (
                <div>
                    Loading ...
                    <RequestBlockNumber />
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
                            <hr />
                            <PendingParcelList />
                        </div>
                    );
                })}
            </div>
        );
    }
}

const Home = connect((state: RootState) => {
    return {
        bestBlockNumber: state.bestBlockNumber,
        blocksByNumber: state.blocksByNumber
    } as StateProps;
})(HomeInternal);

export default Home;
