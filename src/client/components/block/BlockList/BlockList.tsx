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
    return <div className="block-list mt-4">
        <Row className="mb-3">
            <Col>
                <h2>Authored Blocks</h2>
                <hr className="heading-hr" />
            </Col>
        </Row>
        <Row>
            <Col>
                {
                    _.map(prop.blocks, (block, index) => {
                        return (
                            <div key={`block-list-${index}`} className="card-list-item mb-3" >
                                <div className="card-list-item-header">
                                    <Row>
                                        <Col md="3">
                                            <Link to={`/block/${block.number}`}><span className="title">#{block.number}</span></Link>
                                        </Col>
                                        <Col md="9">
                                            <span className="timestamp float-right">{moment.unix(block.timestamp).format("YYYY-MM-DD HH:mm:ssZ")}</span>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="card-list-item-body data-set">
                                    <Row>
                                        <Col md="2">
                                            Hash
                                        </Col>
                                        <Col md="10">
                                            <HexString link={`/block/0x${block.hash}`} text={block.hash} />
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col md="2">
                                            Author
                                        </Col>
                                        <Col md="10">
                                            {PlatformAddress.fromAccountId(block.author).value}
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col md="2">
                                            Reward
                                        </Col>
                                        <Col md="10">
                                            3000 CCC
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        )
                    })
                }
            </Col>
        </Row>
    </div>
};

export default BlockList;
