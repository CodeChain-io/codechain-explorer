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
import { TypeBadge } from "../../../utils/TypeBadge/TypeBadge";

interface Props {
    owner?: string;
    fullScreen: boolean,
    assetType?: H256,
    transactions: TransactionDoc[];
}
const TransactionObjectByType = (transaction: TransactionDoc, assetType?: H256, owner?: string) => {
    if (Type.isAssetMintTransactionDoc(transaction)) {
        const transactionDoc = transaction as AssetMintTransactionDoc;
        return (
            [
                <Row key="asset-type">
                    <Col md="3">
                        AssetType
                    </Col>
                    <Col md="9">
                        <img src={Type.getMetadata(transactionDoc.data.metadata).icon_url} className="icon mr-2" />
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
                                        <div key={`input-${i}`} className={`mt-2 mb-2 data-set input-output-container ${owner && AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value === owner ? "input-highlight" : ""}`}>
                                            <Row>
                                                <Col md="0" />
                                                <Col md="12">
                                                    <img src={Type.getMetadata(input.prevOut.assetScheme.metadata).icon_url} className="icon mr-2" /> {assetType && assetType.value === input.prevOut.assetType ? <HexString text={input.prevOut.assetType} /> : <HexString link={`/asset/0x${input.prevOut.assetType}`} text={input.prevOut.assetType} />}
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
                                                                AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value.slice(0, 10)
                                                                : <Link to={`/addr-asset/${AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value}`}>{AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value.slice(0, 10)}</Link>
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
                            <img src={arrow} alt="Arrow" className="mt-0 mt-md-5" />
                        </Col>
                        <Col md="5">
                            {
                                _.map(transactionDoc.data.outputs, (output, i) => {
                                    return (
                                        <div key={`output-${i}`} className={`mt-2 mb-2 data-set input-output-container ${owner && AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value === owner ? "output-highlight" : ""}`}>
                                            <Row>
                                                <Col md="0" />
                                                <Col md="12">
                                                    <img src={Type.getMetadata(output.assetScheme.metadata).icon_url} className="icon mr-2" /> {assetType && assetType.value === output.assetType ? <HexString text={output.assetType} /> : <HexString link={`/asset/0x${output.assetType}`} text={output.assetType} />}
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
                                                                    AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value.slice(0, 10)
                                                                    : <Link to={`/addr-asset/${AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value}`}>{AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value.slice(0, 10)}</Link>
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

const TransactionList = (props: Props) => {
    const { transactions, assetType, fullScreen, owner } = props;
    return <div className="parcel-transaction-list">
        <Row className="mb-3">
            <Col lg={fullScreen ? "12" : "9"}>
                <h2>Transactions</h2>
                <hr className="heading-hr" />
            </Col>
        </Row>
        <Row>
            <Col lg={fullScreen ? "12" : "9"}>
                {
                    transactions.map((transaction, i: number) => {
                        const hash = transaction.data.hash;
                        return <div key={`parcel-transaction-${hash}`} className="card-list-item mb-3">
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
                                {TransactionObjectByType(transaction, assetType, owner)}
                            </div>
                        </div>
                    })
                }
            </Col>
        </Row>
    </div>
};

export default TransactionList;
