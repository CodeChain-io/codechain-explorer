import * as React from "react";
import * as _ from "lodash";

import { Row, Col } from "reactstrap";

import "./TransactionList.scss"
import HexString from "../../util/HexString/HexString";

import * as arrow from "./img/arrow.png";
import { TransactionDoc, Type, AssetMintTransactionDoc, AssetTransferTransactionDoc } from "../../../db/DocType";
import { H256 } from "codechain-sdk/lib/core/classes";
import { Link } from "react-router-dom";
import { PlatformAddress, AssetTransferAddress } from "codechain-sdk/lib/key/classes";

interface Props {
    owner: string;
    transactions: TransactionDoc[];
}
const TransactionObjectByType = (transaction: TransactionDoc, owner: string) => {
    if (Type.isAssetMintTransactionDoc(transaction)) {
        const transactionDoc = transaction as AssetMintTransactionDoc;
        return (
            <Row>
                <Col>
                    <div className="background-highlight">
                        <Row className="inner-row">
                            <Col md="2">
                                AssetType
                            </Col>
                            <Col md="10">
                                <img src={Type.getMetadata(transactionDoc.data.metadata).icon_url} className="icon mr-2" /> <HexString link={`/asset/0x${transactionDoc.data.output.assetType}`} text={transactionDoc.data.output.assetType} />
                            </Col>
                        </Row>
                        <Row className="inner-row">
                            <Col md="2">
                                Registarar
                            </Col>
                            <Col md="10">
                                {
                                    transactionDoc.data.registrar ?
                                        <Link to={`/addr-platform/${PlatformAddress.fromAccountId(transactionDoc.data.registrar).value}`}>{PlatformAddress.fromAccountId(transactionDoc.data.registrar).value}</Link>
                                        : "Unknown"
                                }
                            </Col>
                        </Row>
                        <Row className="inner-row">
                            <Col md="2">
                                Owner
                            </Col>
                            <Col md="10">
                                {
                                    transactionDoc.data.output.owner ?
                                        (
                                            owner === AssetTransferAddress.fromPublicKeyHash(new H256(transactionDoc.data.output.owner)).value ?
                                                AssetTransferAddress.fromPublicKeyHash(new H256(transactionDoc.data.output.owner)).value
                                                : <Link to={`/addr-asset/${AssetTransferAddress.fromPublicKeyHash(new H256(transactionDoc.data.output.owner)).value}`}>{AssetTransferAddress.fromPublicKeyHash(new H256(transactionDoc.data.output.owner)).value}</Link>
                                        )
                                        : "Unknown"
                                }
                            </Col>
                        </Row>
                        <Row className="inner-row">
                            <Col md="2">
                                Amount
                            </Col>
                            <Col md="10">
                                {transactionDoc.data.output.amount}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        )
    } else if (Type.isAssetTransferTransactionDoc(transaction)) {
        const transactionDoc = transaction as AssetTransferTransactionDoc;
        return (
            <Row>
                <Col>
                    <div>
                        <Row>
                            <Col md="5">
                                {
                                    _.map(transactionDoc.data.inputs, (input, i) => {
                                        return (
                                            <div key={`input-${i}`} className={`background-highlight mb-3 ${AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value === owner ? "input-highlight" : ""}`}>
                                                <Row className="inner-row">
                                                    <Col><img src={Type.getMetadata(input.prevOut.assetScheme.metadata).icon_url} className="icon mr-2" /> <HexString link={`/asset/0x${input.prevOut.assetType}`} text={input.prevOut.assetType} length={30} /></Col>
                                                </Row>
                                                <Row className="inner-row">
                                                    <Col md="4">
                                                        Owner
                                                    </Col>
                                                    <Col md="8">{
                                                        input.prevOut.owner ?
                                                            (
                                                                owner === AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value ?
                                                                    AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value.slice(0, 10)
                                                                    : <Link to={`/addr-asset/${AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value}`}>{AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value.slice(0, 10)}</Link>
                                                            )
                                                            : "Unknown"
                                                    }
                                                    </Col>
                                                </Row>
                                                <Row className="inner-row">
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
                                <img src={arrow} alt="Arrow" className="mt-5" />
                            </Col>
                            <Col md="5">
                                {
                                    _.map(transactionDoc.data.outputs, (output, i) => {
                                        return (
                                            <div key={`output-${i}`} className={`background-highlight mb-3 ${AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value === owner ? "output-highlight" : ""}`}>
                                                <Row className="inner-row">
                                                    <Col><img src={Type.getMetadata(output.assetScheme.metadata).icon_url} className="icon mr-2" /> <HexString link={`/asset/0x${output.assetType}`} text={output.assetType} length={30} /></Col>
                                                </Row>
                                                <Row className="inner-row">
                                                    <Col md="4">
                                                        Owner
                                                    </Col>
                                                    <Col md="8">
                                                        {
                                                            output.owner ?
                                                                (
                                                                    owner === AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value ?
                                                                        AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value.slice(0, 10)
                                                                        : <Link to={`/addr-asset/${AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value}`}>{AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value.slice(0, 10)}</Link>
                                                                )
                                                                : "Unknown"
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row className="inner-row">
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
                </Col>
            </Row>
        )
    }
    return null;
}

const getClassNameByType = (type: string) => {
    if (type === "assetMint") {
        return "asset-mint-type";
    } else if (type === "assetTransfer") {
        return "asset-transfer-type";
    }
    return null;
}

const TransactionList = (props: Props) => {
    const { transactions, owner } = props;
    return <div className="transaction-list">{transactions.map((transaction, i: number) => {
        const hash = transaction.data.hash;
        return <div key={`transaction-${hash}`} className="transaction-item mb-3">
            <div className={`type ${getClassNameByType(transaction.type)}`}>
                {transaction.type}
            </div>
            <Row>
                <Col md="2">
                    Transaction
            </Col>
                <Col md="10">
                    <HexString link={`/tx/0x${hash}`} text={hash} />
                </Col>
            </Row>
            {TransactionObjectByType(transaction, owner)}
        </div>
    })}</div>
};

export default TransactionList;
