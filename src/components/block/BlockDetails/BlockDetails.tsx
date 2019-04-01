import * as _ from "lodash";
import * as React from "react";

import { Col, Row } from "reactstrap";
import DataSet from "../../util/DataSet/DataSet";

import { BlockDoc } from "codechain-indexer-types";
import { Link } from "react-router-dom";
import { CommaNumberString } from "../../util/CommaNumberString/CommaNumberString";
import HexString from "../../util/HexString/HexString";
import "./BlockDetails.scss";

interface OwnProps {
    block: BlockDoc;
}

class BlockDetails extends React.Component<OwnProps> {
    public render() {
        const { block } = this.props;
        return (
            <div className="block-details">
                <Row>
                    <Col>
                        <h2>Details</h2>
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DataSet>
                            <Row>
                                <Col md="3">Parent Block Hash</Col>
                                <Col md="9">
                                    <HexString link={`/block/0x${block.parentHash}`} text={block.parentHash} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Transactions Root</Col>
                                <Col md="9">
                                    <HexString text={block.transactionsRoot} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Results Root</Col>
                                <Col md="9">
                                    <HexString text={block.resultsRoot} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">State Root</Col>
                                <Col md="9">
                                    <HexString text={block.stateRoot} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Author</Col>
                                <Col md="9">
                                    <Link to={`/addr-platform/${block.author}`}>{block.author}</Link>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Score</Col>
                                <Col md="9">
                                    <CommaNumberString text={block.score} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Seal</Col>
                                <Col md="9">
                                    <div className="text-area">
                                        {_.map(block.seal, s => Buffer.from(s).toString("hex")).join(" ")}
                                    </div>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Extra Data</Col>
                                <Col md="9">
                                    <div className="text-area">{Buffer.from(block.extraData)}</div>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3"># of Transactions</Col>
                                <Col md="9">{block.transactionsCount.toLocaleString()}</Col>
                            </Row>
                            <hr />
                        </DataSet>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default BlockDetails;
