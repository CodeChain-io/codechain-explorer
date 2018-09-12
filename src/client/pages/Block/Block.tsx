import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { match } from "react-router";
import { Col, Container, Row } from "reactstrap";
import { Error } from "../../components/error/Error/Error";

import BlockDetails from "../../components/block/BlockDetails/BlockDetails";
import ParcelList from "../../components/parcel/ParcelList/ParcelList";
import { RequestBlock } from "../../request";

import { AssetTransactionGroupDoc, BlockDoc } from "codechain-es/lib/types";
import { Type } from "codechain-es/lib/utils";
import { Link } from "react-router-dom";
import CopyButton from "../../components/util/CopyButton/CopyButton";
import HexString from "../../components/util/HexString/HexString";
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
            <Container className="block">
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
                    </Col>
                    <Col lg="3">
                        <div className="right-panel-item mt-3 mt-lg-0">
                            <h2># of Parcel types</h2>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon className="square payment-action-text-color" icon={faSquare} />
                                <span className="mr-auto item-name">Payment</span>
                                <span>
                                    {_.filter(block.parcels, parcel =>
                                        Type.isPaymentDoc(parcel.action)
                                    ).length.toLocaleString()}
                                </span>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon
                                    className="square asset-transaction-group-action-text-color"
                                    icon={faSquare}
                                />
                                <span className="mr-auto item-name">AssetTransactionGroup</span>
                                <span>
                                    {_.filter(block.parcels, parcel =>
                                        Type.isAssetTransactionGroupDoc(parcel.action)
                                    ).length.toLocaleString()}
                                </span>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon className="square set-regular-key-action-text-color" icon={faSquare} />
                                <span className="mr-auto item-name">SetRegularKey</span>
                                <span>
                                    {_.filter(block.parcels, parcel =>
                                        Type.isSetRegularKeyDoc(parcel.action)
                                    ).length.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="right-panel-item mt-small">
                            <h2># of Transaction types</h2>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon
                                    className="square asset-transfer-transaction-text-color"
                                    icon={faSquare}
                                />
                                <span className="mr-auto item-name">Transfer</span>
                                <span>
                                    {_.reduce(
                                        block.parcels,
                                        (memo, parcel) => {
                                            if (Type.isAssetTransactionGroupDoc(parcel.action)) {
                                                const transactions = (parcel.action as AssetTransactionGroupDoc)
                                                    .transactions;
                                                const assetTransferTransaction = _.filter(transactions, tx =>
                                                    Type.isAssetTransferTransactionDoc(tx)
                                                ).length;
                                                return assetTransferTransaction + memo;
                                            } else {
                                                return memo;
                                            }
                                        },
                                        0
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <hr />
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon className="square asset-mint-transaction-text-color" icon={faSquare} />
                                <span className="mr-auto item-name">Mint</span>
                                <span>
                                    {_.reduce(
                                        block.parcels,
                                        (memo, parcel) => {
                                            if (Type.isAssetTransactionGroupDoc(parcel.action)) {
                                                const transactions = (parcel.action as AssetTransactionGroupDoc)
                                                    .transactions;
                                                const assetTransferTransaction = _.filter(transactions, tx =>
                                                    Type.isAssetMintTransactionDoc(tx)
                                                ).length;
                                                return assetTransferTransaction + memo;
                                            } else {
                                                return memo;
                                            }
                                        },
                                        0
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>
                {block.parcels.length > 0 && (
                    <Row className="mt-large">
                        <Col lg="9">
                            <ParcelList parcels={block.parcels} totalCount={block.parcels.length} />
                        </Col>
                    </Row>
                )}
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
