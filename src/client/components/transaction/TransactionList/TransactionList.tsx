import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";

import { Row, Col } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleRight, faChevronCircleDown } from '@fortawesome/free-solid-svg-icons'

import "./TransactionList.scss"
import HexString from "../../util/HexString/HexString";

import { TransactionDoc, Type, AssetMintTransactionDoc, AssetTransferTransactionDoc } from "../../../../db/DocType";
import { Link } from "react-router-dom";
import { H256 } from "codechain-sdk/lib/core/classes";
import { TypeBadge } from "../../util/TypeBadge/TypeBadge";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";

interface Props {
    owner?: string;
    assetType?: H256,
    transactions: TransactionDoc[];
    loadMoreAction?: () => void;
    totalCount: number;
    hideMoreButton?: boolean;
    hideTitle?: boolean;
}

interface State {
    page: number;
}

class TransactionList extends React.Component<Props, State> {
    private itemPerPage = 3;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1,
        };
    }

    public render() {
        const { page } = this.state;
        const { transactions, assetType, owner, loadMoreAction, totalCount, hideMoreButton, hideTitle } = this.props;
        let loadedTransactions;
        if (loadMoreAction) {
            loadedTransactions = transactions;
        } else {
            loadedTransactions = transactions.slice(0, this.itemPerPage * page);
        }
        return <div className="parcel-transaction-list">
            <Row>
                <Col>
                    <div className="d-flex justify-content-between align-items-end">
                        <h2>Transactions</h2>
                        <span>Total {totalCount} transactions</span>
                    </div>
                    <hr className="heading-hr" />
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        loadedTransactions.map((transaction, i: number) => {
                            const hash = transaction.data.hash;
                            return <div key={`parcel-transaction-${hash}`} className="card-list-item mt-small">
                                <div className="card-list-item-header">
                                    <Row>
                                        <Col md="3">
                                            {
                                                !hideTitle ?
                                                    <span className="title">Transaction #{i}</span>
                                                    : null
                                            }
                                        </Col>
                                        <Col md="9">
                                            <span className="timestamp float-right">{transaction.data.timestamp !== 0 ? moment.unix(transaction.data.timestamp).format("YYYY-MM-DD HH:mm:ssZ") : ""}</span>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="card-list-item-body data-set">
                                    <Row>
                                        <Col md="3">
                                            Type
                                    </Col>
                                        <Col md="9">
                                            <TypeBadge transaction={transaction} />
                                        </Col>
                                    </Row>
                                    <hr />
                                    <Row>
                                        <Col md="3">
                                            Hash
                                    </Col>
                                        <Col md="9">
                                            <HexString link={`/tx/0x${hash}`} text={hash} />
                                        </Col>
                                    </Row>
                                    <hr />
                                    {this.TransactionObjectByType(transaction, assetType, owner)}
                                </div>
                            </div>
                        })
                    }
                </Col>
            </Row>
            {
                !hideMoreButton && (loadMoreAction || this.itemPerPage * page < transactions.length) ?
                    <Row>
                        <Col>
                            <div className="mt-small">
                                <button className="btn btn-primary w-100" onClick={this.loadMore}>
                                    Load Transactions
                                </button>
                            </div>
                        </Col>
                    </Row>
                    : null
            }
        </div>
    }
    private TransactionObjectByType = (transaction: TransactionDoc, assetType?: H256, owner?: string) => {
        if (Type.isAssetMintTransactionDoc(transaction)) {
            const transactionDoc = transaction as AssetMintTransactionDoc;
            return (
                [
                    <Row key="asset-type">
                        <Col md="3">
                            AssetType
                        </Col>
                        <Col md="9">
                            <ImageLoader data={transactionDoc.data.output.assetType} url={Type.getMetadata(transactionDoc.data.metadata).icon_url} className="icon mr-2" size={18} />
                            {assetType && assetType.value === transactionDoc.data.output.assetType ? <HexString text={transactionDoc.data.output.assetType} /> : <HexString link={`/asset/0x${transactionDoc.data.output.assetType}`} text={transactionDoc.data.output.assetType} />}
                        </Col>
                    </Row>,
                    <hr key="line3" />,
                    <Row key="amount">
                        <Col md="3">
                            Amount
                                </Col>
                        <Col md="9">
                            {transactionDoc.data.output.amount ? transactionDoc.data.output.amount.toLocaleString() : 0}
                        </Col>
                    </Row>,
                    <hr key="line1" />,
                    <Row key="registrar">
                        <Col md="3">
                            Registrar
                        </Col>
                        <Col md="9">
                            {
                                transactionDoc.data.registrar ?
                                    <Link to={`/addr-platform/${transactionDoc.data.registrar}`}>{transactionDoc.data.registrar}</Link>
                                    : "None"
                            }
                        </Col>
                    </Row>,
                    <hr key="line2" />,
                    <Row key="owner">
                        <Col md="3">
                            Owner
                        </Col>
                        <Col md="9">
                            {
                                transactionDoc.data.output.owner ?
                                    (
                                        owner && owner === transactionDoc.data.output.owner ?
                                            transactionDoc.data.output.owner
                                            : <Link to={`/addr-asset/${transactionDoc.data.output.owner}`}>{transactionDoc.data.output.owner}</Link>
                                    )
                                    : "Unknown"
                            }
                        </Col>
                    </Row>
                ]
            )
        } else if (Type.isAssetTransferTransactionDoc(transaction)) {
            const transactionDoc = transaction as AssetTransferTransactionDoc;
            return (
                [
                    <Row key="count-of-input">
                        <Col md="3">
                            # of Input
                        </Col>
                        <Col md="9">
                            {transactionDoc.data.inputs.length.toLocaleString()}
                        </Col>
                    </Row>,
                    <hr key="line1" />,
                    <Row key="count-of-output">
                        <Col md="3">
                            # of Output
                        </Col>
                        <Col md="9">
                            {transactionDoc.data.outputs.length.toLocaleString()}
                        </Col>
                    </Row>,
                    <hr key="line2" />,
                    <div key="input-output">
                        <Row>
                            <Col md="5">
                                {
                                    _.map(transactionDoc.data.inputs.slice(0, 3), (input, i) => {
                                        return (
                                            <div key={`input-${i}`} className={`data-set input-output-container ${owner && input.prevOut.owner === owner ? "input-highlight" : ""}`}>
                                                <Row>
                                                    <Col md="0" />
                                                    <Col md="12">
                                                        <ImageLoader data={input.prevOut.assetType} url={Type.getMetadata(input.prevOut.assetScheme.metadata).icon_url} className="icon mr-2" size={18} />
                                                        {assetType && assetType.value === input.prevOut.assetType ? <HexString text={input.prevOut.assetType} /> : <HexString link={`/asset/0x${input.prevOut.assetType}`} text={input.prevOut.assetType} />}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="4">
                                                        Owner
                                                    </Col>
                                                    <Col md="8">{
                                                        input.prevOut.owner ?
                                                            (
                                                                owner && owner === input.prevOut.owner ?
                                                                    input.prevOut.owner
                                                                    : <Link to={`/addr-asset/${input.prevOut.owner}`}>{input.prevOut.owner}</Link>
                                                            )
                                                            : "Unknown"
                                                    }
                                                    </Col>
                                                </Row>
                                                <hr />
                                                <Row>
                                                    <Col md="4">
                                                        Amount
                                                        </Col>
                                                    <Col md="8">
                                                        {input.prevOut.amount.toLocaleString()}
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    transactionDoc.data.inputs.length > 3 ?
                                        <div className="view-more-transfer-btn">
                                            <Link to={`/tx/0x${transactionDoc.data.hash}`}>
                                                <button type="button" className="btn btn-primary w-100">
                                                    <span>View more inputs</span>
                                                </button>
                                            </Link>
                                        </div>
                                        : null
                                }
                            </Col>
                            <Col md="2" className="d-flex align-items-center justify-content-center">
                                <div className="text-center d-none d-md-block arrow-icon">
                                    <FontAwesomeIcon icon={faChevronCircleRight} size="2x" />
                                </div>
                                <div className="d-md-none text-center pt-2 pb-2 arrow-icon">
                                    <FontAwesomeIcon icon={faChevronCircleDown} size="2x" />
                                </div>
                            </Col>
                            <Col md="5">
                                {
                                    _.map(transactionDoc.data.outputs.slice(0, 3), (output, i) => {
                                        return (
                                            <div key={`output-${i}`} className={`data-set input-output-container ${owner && output.owner === owner ? "output-highlight" : ""}`}>
                                                <Row>
                                                    <Col md="0" />
                                                    <Col md="12">
                                                        <ImageLoader data={output.assetType} url={Type.getMetadata(output.assetScheme.metadata).icon_url} className="icon mr-2" size={18} />
                                                        {assetType && assetType.value === output.assetType ? <HexString text={output.assetType} /> : <HexString link={`/asset/0x${output.assetType}`} text={output.assetType} />}
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="4">
                                                        Owner
                                                        </Col>
                                                    <Col md="8">
                                                        {
                                                            output.owner ?
                                                                (
                                                                    owner && owner === output.owner ?
                                                                        output.owner
                                                                        : <Link to={`/addr-asset/${output.owner}`}>{output.owner}</Link>
                                                                )
                                                                : "Unknown"
                                                        }
                                                    </Col>
                                                </Row>
                                                <hr />
                                                <Row>
                                                    <Col md="4">
                                                        Amount
                                                        </Col>
                                                    <Col md="8">
                                                        {output.amount.toLocaleString()}
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                    })
                                }
                                {
                                    transactionDoc.data.outputs.length > 3 ?
                                        <div className="view-more-transfer-btn">
                                            <Link to={`/tx/0x${transactionDoc.data.hash}`}>
                                                <button type="button" className="btn btn-primary w-100">
                                                    <span>View more outputs</span>
                                                </button>
                                            </Link>
                                        </div>
                                        : null
                                }
                            </Col>
                        </Row>
                    </div>
                ]
            )
        }
        return null;
    }

    private loadMore = (e: any) => {
        e.preventDefault();
        if (this.props.loadMoreAction) {
            this.props.loadMoreAction();
        } else {
            this.setState({ page: this.state.page + 1 })
        }
    }
};

export default TransactionList;
