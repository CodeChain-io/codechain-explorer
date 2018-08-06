import * as React from "react";
import * as moment from "moment";
import * as FontAwesome from "react-fontawesome";
import * as _ from "lodash";
import { match } from "react-router";
import { Container, Col, Row } from "reactstrap";
import { Error } from "../../components/error/Error/Error";

import { RequestBlock } from "../../request";
import BlockDetails from "../../components/block/BlockDetails/BlockDetails";
import ParcelList from "../../components/parcel/ParcelList/ParcelList";

import "./Block.scss";
import { BlockDoc, Type, ChangeShardStateDoc } from "../../../db/DocType";
import { Link } from "react-router-dom";
import HexString from "../../components/util/HexString/HexString";

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
        const { match: { params: { id } } } = this.props;
        const { match: { params: { id: nextId } } } = props;
        if (nextId !== id) {
            this.setState({ block: undefined, notFound: false });
        }
    }

    public render() {
        const { match: { params: { id } } } = this.props;
        const { block, notFound } = this.state;

        if (notFound) {
            return (
                <div>
                    <Error content={id.toString()} title="The block does not exist." />
                </div>
            )
        }
        if (!block) {
            return <RequestBlock id={id} onBlock={this.onBlock} onError={this.onError} onBlockNotExist={this.onBlockNotExist} />;
        }
        return (
            <Container className="block">
                <Row>
                    <Col md="8" xl="7">
                        <div className="d-flex align-items-end title-container">
                            <h1 className="d-inline-block mr-auto">Block <span className="block-number">#{block.number}</span></h1>
                            <span className="timestamp">{moment.unix(block.timestamp).format("YYYY-MM-DD HH:mm:ssZ")}</span>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="8" xl="7" className="hash-container d-flex">
                        <div className="d-inline-block hash">
                            <HexString text={block.hash} />
                        </div>
                        <div className="d-inline-block copy text-center">
                            <FontAwesome name="copy" />
                        </div>
                    </Col>
                    <Col md="3" xl="2" className="d-flex align-items-center justify-content-between offset-md-1 offset-xl-3 mt-2 mt-md-0">
                        <Link to={block.number !== 0 ? `/block/${block.number - 1}` : "#"}><button type="button" className={`btn btn-primary ${block.number === 0 ? "disabled" : ""}`}>&lt; Prev</button></Link>
                        <Link to={`/block/${block.number + 1}`}><button type="button" className="btn btn-primary">Next &gt;</button></Link>
                    </Col>
                </Row>
                <Row className="mt-large">
                    <Col lg="9">
                        <BlockDetails block={block} />
                    </Col>
                    <Col lg="3">
                        <div className="right-panel-item mt-3 mt-lg-0">
                            <h2># of Parcel types</h2>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesome className="square payment-action-text-color" name="square" />
                                <span className="mr-auto item-name">Payment</span>
                                <span>{_.filter(block.parcels, (parcel) => Type.isPaymentDoc(parcel.action)).length}</span>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesome className="square change-shard-state-action-text-color" name="square" />
                                <span className="mr-auto item-name">ChangeShardState</span>
                                <span>{_.filter(block.parcels, (parcel) => Type.isChangeShardStateDoc(parcel.action)).length}</span>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesome className="square set-regular-key-action-text-color" name="square" />
                                <span className="mr-auto item-name">SetRegularKey</span>
                                <span>{_.filter(block.parcels, (parcel) => Type.isSetRegularKeyDoc(parcel.action)).length}</span>
                            </div>
                        </div>
                        <div className="right-panel-item mt-small">
                            <h2># of Transaction types</h2>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesome className="square asset-transfer-transaction-text-color" name="square" />
                                <span className="mr-auto item-name">Transfer</span>
                                <span>
                                    {_.reduce(block.parcels, (memo, parcel) => {
                                        if (Type.isChangeShardStateDoc(parcel.action)) {
                                            const transactions = (parcel.action as ChangeShardStateDoc).transactions;
                                            const assetTransferTransaction = _.filter(transactions, (tx) => Type.isAssetTransferTransactionDoc(tx)).length;
                                            return assetTransferTransaction + memo;
                                        } else {
                                            return memo;
                                        }
                                    }, 0)}</span>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesome className="square asset-mint-transaction-text-color" name="square" />
                                <span className="mr-auto item-name">Mint</span>
                                <span>
                                    {_.reduce(block.parcels, (memo, parcel) => {
                                        if (Type.isChangeShardStateDoc(parcel.action)) {
                                            const transactions = (parcel.action as ChangeShardStateDoc).transactions;
                                            const assetTransferTransaction = _.filter(transactions, (tx) => Type.isAssetMintTransactionDoc(tx)).length;
                                            return assetTransferTransaction + memo;
                                        } else {
                                            return memo;
                                        }
                                    }, 0)}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="mt-large">
                    <Col lg="9">
                        <ParcelList parcels={block.parcels} />
                    </Col>
                </Row>
            </Container>
        );
    }

    private onBlockNotExist = () => {
        this.setState({ notFound: true });
    }

    private onBlock = (block: BlockDoc) => {
        this.setState({ block });
    };

    private onError = (e: any) => {
        console.log(e);
    };
}

export default Block;
