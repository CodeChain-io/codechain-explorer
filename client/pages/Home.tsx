import * as React from 'react';
import * as _ from "lodash";
import { RequestBlockNumber, RequestBlock } from '../request';
import { Container, Row, Col } from 'reactstrap';
import { Block } from 'codechain-sdk';
import LatestBlocks from '../components/home/LatestBlocks/LatestBlocks';
import LatestParcels from '../components/home/LatestParcels/LatestParcels';
import LatestTransactions from '../components/home/LatestTransactions/LatestTransactions';

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
                    <Container>
                        Loading ...
                        <RequestBlockNumber
                            repeat={1000}
                            onBlockNumber={this.onBlockNumber}
                            onError={this.onError} />
                    </Container>
                </div>
            );
        }
        return (
            <div>
                <Container>
                    <Row>
                        <Col className="mt-3">
                            <LatestBlocks blocksByNumber={blocksByNumber} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="mt-3">
                            <LatestParcels blocksByNumber={blocksByNumber} />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col className="mt-3">
                            <LatestTransactions blocksByNumber={blocksByNumber} />
                        </Col>
                    </Row>
                    {/* Reqest blocks */}
                    {_.map(_.reverse(_.range(0, bestBlockNumber + 1)), n => {
                        return <RequestBlock key={'request-block-num-' + n} id={n} onBlock={this.onBlock} onError={this.onError} />
                    })}
                </Container>
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

    private onError = () => ({/* Not implemented */ })
}

export default Home;
