import * as _ from "lodash";
import * as React from "react";

import { Col, Row } from "reactstrap";

import * as moment from "moment";

import { BlockDoc } from "codechain-es/lib/types";
import { Link } from "react-router-dom";
import { changeQuarkStringToCCC } from "../../../utils/Formatter";
import { CommaNumberString } from "../../util/CommaNumberString/CommaNumberString";
import DataSet from "../../util/DataSet/DataSet";
import HexString from "../../util/HexString/HexString";
import "./BlockList.scss";

interface Props {
    blocks: BlockDoc[];
    loadMoreAction?: () => void;
    totalCount: number;
    hideMoreButton?: boolean;
}

interface State {
    page: number;
}

class BlockList extends React.Component<Props, State> {
    private itemPerPage = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1
        };
    }

    public render() {
        const { page } = this.state;
        const { blocks, totalCount, loadMoreAction, hideMoreButton } = this.props;
        let loadedBlocks = blocks.slice(0, this.itemPerPage * page);
        if (loadMoreAction) {
            loadedBlocks = blocks;
        } else {
            loadedBlocks = blocks.slice(0, this.itemPerPage * page);
        }
        return (
            <div className="block-list mt-large">
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-end">
                            <h2>Authored Blocks</h2>
                            <span>Total {totalCount} blocks</span>
                        </div>
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {_.map(loadedBlocks, (block, index) => {
                            return (
                                <div key={`block-list-${index}`} className="card-list-item mt-small">
                                    <div className="card-list-item-header">
                                        <Row>
                                            <Col md="3">
                                                <Link to={`/block/${block.number}`}>
                                                    <span className="title">Block #{block.number}</span>
                                                </Link>
                                            </Col>
                                            <Col md="9">
                                                <span className="timestamp float-right">
                                                    {block.timestamp
                                                        ? moment.unix(block.timestamp).format("YYYY-MM-DD HH:mm:ssZ")
                                                        : "Genesis"}
                                                </span>
                                            </Col>
                                        </Row>
                                    </div>
                                    <DataSet className="card-list-item-body">
                                        <Row>
                                            <Col md="2">Hash</Col>
                                            <Col md="10">
                                                <HexString link={`/block/0x${block.hash}`} text={block.hash} />
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="2">Author</Col>
                                            <Col md="10">{block.author}</Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="2">Reward</Col>
                                            <Col md="10">
                                                <CommaNumberString text={changeQuarkStringToCCC(block.miningReward)} />
                                                CCC
                                            </Col>
                                        </Row>
                                    </DataSet>
                                </div>
                            );
                        })}
                    </Col>
                </Row>
                {!hideMoreButton && (loadMoreAction || this.itemPerPage * page < blocks.length) ? (
                    <Row>
                        <Col>
                            <div className="mt-small">
                                <button className="btn btn-primary w-100" onClick={this.loadMore}>
                                    Load blocks
                                </button>
                            </div>
                        </Col>
                    </Row>
                ) : null}
            </div>
        );
    }

    private loadMore = (e: any) => {
        e.preventDefault();
        if (this.props.loadMoreAction) {
            this.props.loadMoreAction();
        } else {
            this.setState({ page: this.state.page + 1 });
        }
    };
}

export default BlockList;
