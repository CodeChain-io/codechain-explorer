import * as React from 'react';
import * as _ from "lodash";
import { connect } from 'react-redux';
import { RootState } from '../redux/actions';
import { RequestBlockNumber } from '../components/requests';
import { Link } from 'react-router-dom';

interface StateProps {
    bestBlockNumber?: number;
}

class HomeInternal extends React.Component<StateProps> {
    public render() {
        const { bestBlockNumber } = this.props;
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
                {_.map(_.range(1, bestBlockNumber + 1), n => (
                    <div key={`home-block-num-${n}`}>
                        <Link to={`/block/${n}`}>{n}</Link>
                    </div>
                ))}
            </div>
        );
    }
}

const Home = connect((state: RootState) => {
    return {
        bestBlockNumber: state.bestBlockNumber
    } as StateProps;
})(HomeInternal);

export default Home;
