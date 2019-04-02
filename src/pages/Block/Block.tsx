import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { match } from "react-router";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { BlockDoc } from "codechain-indexer-types";

import BlockDetails from "../../components/block/BlockDetails/BlockDetails";
import { Error } from "../../components/error/Error/Error";
import BlockTransactionList from "../../components/transaction/BlockTransactionList/BlockTransactionList";
import CopyButton from "../../components/util/CopyButton/CopyButton";
import HexString from "../../components/util/HexString/HexString";
import { RequestBlock } from "../../request";
import { TransactionTypes } from "../../utils/Transactions";

import "./Block.scss";

interface State {
    block?: BlockDoc;
    notFound: boolean;
}

interface Props {
    match: match<{ id: number | string }>;
}

class Block extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            notFound: false
        };
    }

    public componentWillReceiveProps(props: Props) {
        const {
            match: {
                params: { id }
            }
        } = this.props;
        const {
            match: {
                params: { id: nextId }
            }
        } = props;
        if (nextId !== id) {
            this.setState({ block: undefined, notFound: false });
        }
    }

    public render() {
        const {
            match: {
                params: { id }
            }
        } = this.props;
        const { block, notFound } = this.state;

        if (notFound) {
            return (
                <div>
                    <Error content={id.toString()} title="The block does not exist." />
                </div>
            );
        }
        if (!block) {
            return (
                <RequestBlock
                    id={id}
                    onBlock={this.onBlock}
                    onError={this.onError}
                    onBlockNotExist={this.onBlockNotExist}
                />
            );
        }
        return (
            <Container className="block animated fadeIn">
                <Row>
                    <Col md="8" xl="7">
                        <div className="d-flex align-items-end title-container">
                            <h1 className="d-inline-block mr-auto">
                                Block <span className="block-number">#{block.number}</span>
                            </h1>
                            <span className="timestamp">
                                {block.timestamp
                                    ? moment.unix(block.timestamp).format("YYYY-MM-DD HH:mm:ssZ")
                                    : "Genesis"}
                            </span>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="8" xl="7" className="hash-container d-flex">
                        <div className="d-inline-block hash">
                            <HexString text={block.hash} />
                        </div>
                        <CopyButton className="d-inline-block" copyString={`0x${block.hash}`} />
                    </Col>
                    <Col
                        md="3"
                        xl="2"
                        className="d-flex align-items-center justify-content-between offset-md-1 offset-xl-3 mt-2 mt-md-0"
                    >
                        <Link to={block.number !== 0 ? `/block/${block.number - 1}` : "#"}>
                            <button
                                type="button"
                                disabled={block.number === 0}
                                className={`btn btn-primary ${block.number === 0 ? "disabled" : ""}`}
                            >
                                &lt; Prev
                            </button>
                        </Link>
                        <Link to={`/block/${block.number + 1}`}>
                            <button type="button" className="btn btn-primary">
                                Next &gt;
                            </button>
                        </Link>
                    </Col>
                </Row>
                <Row className="mt-large">
                    <Col lg="9">
                        <BlockDetails block={block} />
                        {block.transactionsCount > 0 && (
                            <div key="parcel-transaction" className="mt-large">
                                <BlockTransactionList blockId={block.number} totalCount={block.transactionsCount} />
                            </div>
                        )}
                    </Col>
                    <Col lg="3">
                        <div className="right-panel-item mt-3 mt-lg-0">
                            <h2># of Transaction types</h2>
                            <hr />
                            {TransactionTypes.map(tt => {
                                return [
                                    <div className="d-flex align-items-center" key="asset-info">
                                        <span className="mr-auto item-name">{tt}</span>
                                        {/* FIXME: */}
                                        <span>{0}</span>
                                    </div>,
                                    <hr key="hr" />
                                ];
                            })}
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    private onBlockNotExist = () => {
        this.setState({ notFound: true });
    };

    private onBlock = (block: BlockDoc) => {
        this.setState({ block });
    };

    private onError = (e: any) => {
        console.log(e);
    };
}

export default Block;
