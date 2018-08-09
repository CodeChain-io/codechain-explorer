import * as React from "react";
import * as _ from "lodash";

import { Col, Row } from "reactstrap";

import "./BlockDetails.scss"
import HexString from "../../util/HexString/HexString";
import { BlockDoc, Type, ChangeShardStateDoc } from "../../../../db/DocType";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";
import { Link } from "react-router-dom";
import { CommaNumberString } from "../../util/CommaNumberString/CommaNumberString";

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
                        <div className="data-set">
                            <Row>
                                <Col md="3">
                                    Parent Block Hash
                                </Col>
                                <Col md="9">
                                    <HexString link={`/block/0x${block.parentHash}`} text={block.parentHash} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Parcels Root
                                </Col>
                                <Col md="9">
                                    <HexString text={block.parcelsRoot} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Invoices Root
                                </Col>
                                <Col md="9">
                                    <HexString text={block.invoicesRoot} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    State Root
                                </Col>
                                <Col md="9">
                                    <HexString text={block.stateRoot} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Author
                                </Col>
                                <Col md="9">
                                    <Link to={`/addr-platform/${PlatformAddress.fromAccountId(block.author).value}`}>{PlatformAddress.fromAccountId(block.author).value}</Link>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Score
                                </Col>
                                <Col md="9">
                                    <CommaNumberString text={block.score} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Seal
                                </Col>
                                <Col md="9">
                                    <div className="text-area">
                                        {block.seal}
                                    </div>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Extra Data
                                </Col>
                                <Col md="9">
                                    <div className="text-area">
                                        {block.extraData}
                                    </div>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    # of Parcels
                                </Col>
                                <Col md="9">
                                    {block.parcels.length.toLocaleString()}
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    # of Transactions
                                </Col>
                                <Col md="9">
                                    {_.reduce(block.parcels, (memo, parcel) => {
                                        if (Type.isChangeShardStateDoc(parcel.action)) {
                                            return (parcel.action as ChangeShardStateDoc).transactions.length + memo;
                                        } else {
                                            return memo;
                                        }
                                    }, 0).toLocaleString()}
                                </Col>
                            </Row>
                            <hr />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default BlockDetails;
