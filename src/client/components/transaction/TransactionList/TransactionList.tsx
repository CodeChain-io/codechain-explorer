import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";

import { Row, Col } from "reactstrap";

import "./TransactionList.scss"
import HexString from "../../util/HexString/HexString";

import * as arrow from "./img/arrow.png";
import { TransactionDoc, Type, AssetMintTransactionDoc, AssetTransferTransactionDoc } from "../../../../db/DocType";
import { Link } from "react-router-dom";
import { PlatformAddress, AssetTransferAddress } from "codechain-sdk/lib/key/classes";
import { H256 } from "codechain-sdk/lib/core/classes";
import { TypeBadge } from "../../util/TypeBadge/TypeBadge";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";

interface Props {
    owner?: string;
    assetType?: H256,
    transactions: TransactionDoc[];
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
    public componentWillReceiveProps() {
        this.setState({ page: 1 });
    }

    public render() {
        const { page } = this.state;
        const { transactions, assetType, owner } = this.props;
        const loadedTransactions = transactions.slice(0, this.itemPerPage * page);
        return <div className="parcel-transaction-list">
            <Row>
                <Col>
                    <h2>Transactions</h2>
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
                                            <span className="title">#{i}</span>
                                        </Col>
                                        <Col md="9">
                                            <span className="timestamp float-right">{moment.unix(transaction.data.timestamp).format("YYYY-MM-DD HH:mm:ssZ")}</span>
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
                this.itemPerPage * page < transactions.length ?
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
                            {
                                Type.getMetadata(transactionDoc.data.metadata).icon_url ?
                                    <ImageLoader url={Type.getMetadata(transactionDoc.data.metadata).icon_url} className="icon mr-2" size={18} />
                                    : <ImageLoader data={transactionDoc.data.output.assetType} className="icon mr-2" size={18} />
                            }
                            {assetType && assetType.value === transactionDoc.data.output.assetType ? <HexString text={transactionDoc.data.output.assetType} /> : <HexString link={`/asset/0x${transactionDoc.data.output.assetType}`} text={transactionDoc.data.output.assetType} />}
                        </Col>
                    </Row>,
                    <hr key="line3" />,
                    <Row key="amount">
                        <Col md="3">
                            Amount
                                </Col>
                        <Col md="9">
                            {transactionDoc.data.output.amount}
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
                                    <Link to={`/addr-platform/${PlatformAddress.fromAccountId(transactionDoc.data.registrar).value}`}>{PlatformAddress.fromAccountId(transactionDoc.data.registrar).value}</Link>
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
                                        owner && owner === AssetTransferAddress.fromPublicKeyHash(new H256(transactionDoc.data.output.owner)).value ?
                                            AssetTransferAddress.fromPublicKeyHash(new H256(transactionDoc.data.output.owner)).value
                                            : <Link to={`/addr-asset/${AssetTransferAddress.fromPublicKeyHash(new H256(transactionDoc.data.output.owner)).value}`}>{AssetTransferAddress.fromPublicKeyHash(new H256(transactionDoc.data.output.owner)).value}</Link>
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
                            {transactionDoc.data.inputs.length}
                        </Col>
                    </Row>,
                    <hr key="line1" />,
                    <Row key="count-of-output">
                        <Col md="3">
                            # of Output
                        </Col>
                        <Col md="9">
                            {transactionDoc.data.outputs.length}
                        </Col>
                    </Row>,
                    <hr key="line2" />,
                    <div key="input-output">
                        <Row>
                            <Col md="5">
                                {
                                    _.map(transactionDoc.data.inputs, (input, i) => {
                                        return (
                                            <div key={`input-${i}`} className={`data-set input-output-container ${owner && AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value === owner ? "input-highlight" : ""}`}>
                                                <Row>
                                                    <Col md="0" />
                                                    <Col md="12">
                                                        {
                                                            Type.getMetadata(input.prevOut.assetScheme.metadata).icon_url ?
                                                                <ImageLoader url={Type.getMetadata(input.prevOut.assetScheme.metadata).icon_url} className="icon mr-2" size={18} />
                                                                : <ImageLoader data={input.prevOut.assetType} className="icon mr-2" size={18} />
                                                        }
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
                                                                owner && owner === AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value ?
                                                                    AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value
                                                                    : <Link to={`/addr-asset/${AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value}`}>{AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value}</Link>
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
                                                        {input.prevOut.amount}
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                    })
                                }
                            </Col>
                            <Col md="2" className="text-center">
                                <img src={arrow} alt="Arrow" className="arrow" />
                            </Col>
                            <Col md="5">
                                {
                                    _.map(transactionDoc.data.outputs, (output, i) => {
                                        return (
                                            <div key={`output-${i}`} className={`data-set input-output-container ${owner && AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value === owner ? "output-highlight" : ""}`}>
                                                <Row>
                                                    <Col md="0" />
                                                    <Col md="12">
                                                        {
                                                            Type.getMetadata(output.assetScheme.metadata).icon_url ?
                                                                <ImageLoader url={Type.getMetadata(output.assetScheme.metadata).icon_url} className="icon mr-2" size={18} />
                                                                : <ImageLoader data={output.assetType} className="icon mr-2" size={18} />
                                                        }
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
                                                                    owner && owner === AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value ?
                                                                        AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value
                                                                        : <Link to={`/addr-asset/${AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value}`}>{AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value}</Link>
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
                                                        {output.amount}
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                    })
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
        this.setState({ page: this.state.page + 1 })
    }
};

export default TransactionList;
