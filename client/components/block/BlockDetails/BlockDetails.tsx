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
                    <Col md="2">
                        Hash
                    </Col>
                    <Col md="10">
                        <HexString text={block.hash.value} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Parent Block Hash
                    </Col>
                    <Col md="10">
                        <HexString link={`/block/0x${block.parentHash.value}`} text={block.parentHash.value} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Parcels Root
                    </Col>
                    <Col md="10">
                        <HexString text={block.parcelsRoot.value} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Invoices Root
                    </Col>
                    <Col md="10">
                        <HexString text={block.invoicesRoot.value} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        State Root
                    </Col>
                    <Col md="10">
                        <HexString text={block.stateRoot.value} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Extra Data
                    </Col>
                    <Col md="10">
                        {block.extraData}
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Author
                    </Col>
                    <Col md="10">
                        <HexString link={`/address/0x${block.author.value}`} text={block.author.value} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Timestamp
                    </Col>
                    <Col md="10">
                        {block.timestamp}
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Score
                    </Col>
                    <Col md="10">
                        {block.score.value.toString()}
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Seal
                    </Col>
                    <Col md="10">
                        {block.seal}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default BlockDetails;
