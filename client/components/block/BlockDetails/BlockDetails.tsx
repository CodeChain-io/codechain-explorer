import * as React from "react";

import { Block } from "codechain-sdk/lib/core/classes";
import { Col, Row } from 'reactstrap';

import "./BlockDetails.scss"
import HexString from "../../util/HexString/HexString";

interface OwnProps {
    block: Block;
}

class BlockDetails extends React.Component<OwnProps> {
    public render() {
        const { block } = this.props;
        return (
            <div className="block-details">
                <Row>
                    <Col md="2" className="info-col">
                        Hash
                    </Col>
                    <Col md="10" className="info-col">
                        <HexString text={block.hash.value} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2" className="info-col">
                        Parent Block Hash
                    </Col>
                    <Col md="10" className="info-col">
                        <HexString link={`/block/0x${block.parentHash.value}`} text={block.parentHash.value} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2" className="info-col">
                        Parcels Root
                    </Col>
                    <Col md="10" className="info-col">
                        <HexString text={block.parcelsRoot.value} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2" className="info-col">
                        Invoices Root
                    </Col>
                    <Col md="10" className="info-col">
                        <HexString text={block.invoicesRoot.value} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2" className="info-col">
                        State Root
                    </Col>
                    <Col md="10" className="info-col">
                        <HexString text={block.stateRoot.value} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2" className="info-col">
                        Extra Data
                    </Col>
                    <Col md="10" className="info-col">
                        {block.extraData}
                    </Col>
                </Row>
                <Row>
                    <Col md="2" className="info-col">
                        Author
                    </Col>
                    <Col md="10" className="info-col">
                        <HexString link={`/address/0x${block.author.value}`} text={block.author.value} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2" className="info-col">
                        Timestamp
                    </Col>
                    <Col md="10" className="info-col">
                        {block.timestamp}
                    </Col>
                </Row>
                <Row>
                    <Col md="2" className="info-col">
                        Score
                    </Col>
                    <Col md="10" className="info-col">
                        {block.score.value.toString()}
                    </Col>
                </Row>
                <Row>
                    <Col md="2" className="info-col">
                        Seal
                    </Col>
                    <Col md="10" className="info-col">
                        {block.seal}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default BlockDetails;
