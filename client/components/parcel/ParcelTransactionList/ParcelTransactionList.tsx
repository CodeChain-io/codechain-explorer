import * as React from "react";
import * as _ from "lodash";

import { Row, Col } from "reactstrap";
import { Transaction, AssetMintTransaction, AssetTransferTransaction } from "codechain-sdk/lib/core/classes";

import "./ParcelTransactionList.scss"
import HexString from "../../util/HexString/HexString";

interface Props {
    transactions: Transaction[];
}
const TransactionObjectByType = (transaction: Transaction) => {
    if (transaction instanceof AssetMintTransaction) {
        return (
            <Row>
                <Col>
                    <div className="background-highlight">
                        <Row className="inner-row">
                            <Col md="2">
                                AssetType
                            </Col>
                            <Col md="10">
                                <HexString link={`/asset/0x${transaction.getAssetSchemeAddress().value}`} text={transaction.getAssetSchemeAddress().value} />
                            </Col>
                        </Row>
                        <Row className="inner-row">
                            <Col md="2">
                                Registarar
                            </Col>
                            <Col md="10">
                                {
                                    transaction.toJSON().data.registrar ?
                                        <HexString link={`/addr-platform/0x${transaction.toJSON().data.registrar}`} text={(transaction.toJSON().data.registrar as string)} />
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
                                    transaction.toJSON().data.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ?
                                        <HexString link={`/addr-asset/0x${transaction.toJSON().data.parameters[0].toString("hex")}`} text={transaction.toJSON().data.parameters[0].toString("hex")} />
                                        : "Unknown"
                                }
                            </Col>
                        </Row>
                        <Row className="inner-row">
                            <Col md="2">
                                Amount
                            </Col>
                            <Col md="10">
                                {transaction.toJSON().data.amount}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        )
    } else if (transaction instanceof AssetTransferTransaction) {
        return (
            <Row>
                <Col>
                    <div>
                        <Row>
                            <Col md="5">
                                {
                                    _.map(transaction.inputs, (input, i) => {
                                        return (
                                            <div key={`input-${i}`} className="background-highlight mb-3">
                                                <Row className="inner-row">
                                                    <Col><HexString link={`/asset/0x${input.prevOut.assetType.value}`} text={input.prevOut.assetType.value} length={40} /></Col>
                                                </Row>
                                                <Row className="inner-row">
                                                    <Col md="4">
                                                        Owner
                                                    </Col>
                                                    <Col md="8">
                                                        owner
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
                                >
                            </Col>
                            <Col md="5">
                                {
                                    _.map(transaction.outputs, (output, i) => {
                                        return (
                                            <div key={`output-${i}`} className="background-highlight mb-3">
                                                <Row className="inner-row">
                                                    <Col><HexString link={`/asset/0x${output.toJSON().assetType}`} text={output.toJSON().assetType} length={40} /></Col>
                                                </Row>
                                                <Row className="inner-row">
                                                    <Col md="4">
                                                        Owner
                                                    </Col>
                                                    <Col md="8">
                                                        {
                                                            output.toJSON().lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ?
                                                                <HexString link={`/addr-asset/0x${output.toJSON().parameters[0].toString("hex")}`} text={output.toJSON().parameters[0].toString("hex")} length={10} />
                                                                : "Unknown"
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row className="inner-row">
                                                    <Col md="4">
                                                        Amount
                                                    </Col>
                                                    <Col md="8">
                                                        {output.toJSON().amount}
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

const ParcelTransactionList = (props: Props) => {
    const { transactions } = props;
    return <div className="parcel-transaction-list">{transactions.map((transaction, i: number) => {
        const hash = transaction.hash().value;
        return <div key={`parcel-transaction-${hash}`} className="transaction-item">
            <div className={`type ${getClassNameByType(transaction.toJSON().type)}`}>
                {transaction.toJSON().type}
            </div>
            <Row>
                <Col md="2">
                    Transaction
            </Col>
                <Col md="10">
                    <HexString link={`/tx/0x${hash}`} text={hash} />
                </Col>
            </Row>
            {TransactionObjectByType(transaction)}
        </div>
    })}</div>
};

export default ParcelTransactionList;
