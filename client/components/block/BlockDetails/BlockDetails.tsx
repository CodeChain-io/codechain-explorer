import * as React from "react";

import { Col, Row } from 'reactstrap';

import * as moment from "moment";

import "./BlockDetails.scss"
import HexString from "../../util/HexString/HexString";
import { BlockDoc } from "../../../db/DocType";

interface OwnProps {
    block: BlockDoc;
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
                        <HexString text={block.hash} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Parent Block Hash
                    </Col>
                    <Col md="10">
                        <HexString link={`/block/0x${block.parentHash}`} text={block.parentHash} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Parcels Root
                    </Col>
                    <Col md="10">
                        <HexString text={block.parcelsRoot} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Invoices Root
                    </Col>
                    <Col md="10">
                        <HexString text={block.invoicesRoot} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        State Root
                    </Col>
                    <Col md="10">
                        <HexString text={block.stateRoot} />
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
                        <HexString link={`/addr-platform/0x${block.author}`} text={block.author} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Timestamp
                    </Col>
                    <Col md="10">
                        {moment.unix(block.timestamp).format("YYYY-MM-DD HH:mm:ssZ")}
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Score
                    </Col>
                    <Col md="10">
                        {block.score}
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
