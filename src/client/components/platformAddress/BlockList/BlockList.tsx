import * as React from "react";
import * as _ from "lodash";

import { Row, Col } from "reactstrap";

import * as moment from "moment";

import "./BlockList.scss";
import HexString from "../../util/HexString/HexString";
import { BlockDoc } from "../../../../db/DocType";
import { Link } from "react-router-dom";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";

interface OwnProps {
    blocks: BlockDoc[]
}

const BlockList = (prop: OwnProps) => {
    return <div className="block-list">
        {
            _.map(prop.blocks, (block, index) => {
                return (
                    <div key={`block-list-${index}`} className="block-item mb-3" >
                        <Row>
                            <Col md="2">
                                Block
                            </Col>
                            <Col md="10">
                                <HexString link={`/block/0x${block.hash}`} text={block.hash} />(#<Link to={`/block/${block.number}`}>{block.number}</Link>)
                            </Col>
                        </Row>
                        <Row>
                            <Col md="2">
                                Author
                            </Col>
                            <Col md="10">
                                {PlatformAddress.fromAccountId(block.author).value}
                            </Col>
                        </Row>
                        <Row>
                            <Col md="2">
                                Reward
                            </Col>
                            <Col md="10">
                                3000 CCC
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
                    </div>
                )
            })
        }
    </div>
};

export default BlockList;
