import * as React from "react";
import * as _ from "lodash";

import { Col, Row } from "reactstrap";

import "./TransactionDetails.scss"
import HexString from "../../util/HexString/HexString";
import { TransactionDoc, Type, AssetTransferTransactionDoc, AssetMintTransactionDoc } from "../../../../db/DocType";
import { Script, H256 } from "codechain-sdk/lib/core/classes";
import { Buffer } from "buffer";
import { Link } from "react-router-dom";
import { PlatformAddress, AssetTransferAddress } from "codechain-sdk/lib/key/classes";

interface Props {
    transaction: TransactionDoc;
}

const getTransactionInfoByType = (transaction: TransactionDoc) => {
    if (Type.isAssetTransferTransactionDoc(transaction)) {
        const transactionDoc = transaction as AssetTransferTransactionDoc;
        return (
            [
                <Row key="details" className="mb-4">
                    <Col lg="9" className="mb-3 mb-lg-0">
                        <div className="data-set">
                            <Row>
                                <Col md="3">
                                    NetworkID
                                </Col>
                                <Col md="9">
                                    {transactionDoc.data.networkId}
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">
                                    Nonce
                                </Col>
                                <Col md="9">
                                    {transactionDoc.data.nonce}
                                </Col>
                            </Row>
                            <hr />
                        </div>
                    </Col>
                </Row>,
                <div key="input">
                    {
                        _.map(transactionDoc.data.inputs, (input, index) => {
                            return ([
                                <Row key={`transaction-header-table-input-title-${index}`}>
                                    <Col lg="9">
                                        <h2>Input #{index}</h2>
                                        <hr className="heading-hr" />
                                    </Col>
                                </Row>,
                                <Row key={`transaction-header-table-input-detail-${index}`} className="mb-4">
                                    <Col lg="9">
                                        <div className="data-set">
                                            <Row>
                                                <Col md="3">
                                                    AssetType
                                                </Col>
                                                <Col md="9">
                                                    <img src={Type.getMetadata(input.prevOut.assetScheme.metadata).icon_url} className="icon mr-2" /><HexString link={`/asset/0x${input.prevOut.assetType}`} text={input.prevOut.assetType} />
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="3">
                                                    Owner
                                                </Col>
                                                <Col md="9">
                                                    {input.prevOut.owner ? <Link to={`/addr-asset/${AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value}`}>{AssetTransferAddress.fromPublicKeyHash(new H256(input.prevOut.owner)).value}</Link>
                                                        : "Unknown"}
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="3">
                                                    Amount
                                                </Col>
                                                <Col md="9">
                                                    {input.prevOut.amount}
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="3">
                                                    LockScript
                                                </Col>
                                                <Col md="9">
                                                    <div className="text-area">
                                                        {new Script(input.lockScript).toTokens().join(" ")}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="3">
                                                    UnlockScript
                                                </Col>
                                                <Col md="9">
                                                    <div className="text-area">
                                                        {new Script(input.unlockScript).toTokens().join(" ")}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="3">
                                                    Prev Tx
                                                </Col>
                                                <Col md="9">
                                                    <HexString link={`/tx/0x${input.prevOut.transactionHash}`} text={input.prevOut.transactionHash} />
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="3">
                                                    Prev Tx Index
                                                </Col>
                                                <Col md="9">
                                                    {input.prevOut.index}
                                                </Col>
                                            </Row>
                                            <hr />
                                        </div>
                                    </Col>
                                </Row>
                            ])
                        })
                    }
                </div>,
                <div key="output">
                    {
                        _.map(transactionDoc.data.outputs, (output, index) => {
                            return ([
                                <Row key={`transaction-header-table-output-title-${index}`}>
                                    <Col lg="9">
                                        <h2>Output #{index}</h2>
                                        <hr className="heading-hr" />
                                    </Col>
                                </Row>,
                                <Row key={`transaction-header-table-output-details-${index}`} className="mb-4">
                                    <Col lg="9">
                                        <div className="data-set">
                                            <Row>
                                                <Col md="3">
                                                    AssetType
                                                </Col>
                                                <Col md="9">
                                                    <img src={Type.getMetadata(output.assetScheme.metadata).icon_url} className="icon mr-2" /><HexString link={`/asset/0x${output.assetType}`} text={output.assetType} />
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="3">
                                                    Owner
                                                </Col>
                                                <Col md="9">{
                                                    output.owner ? <Link to={`/addr-asset/${AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value}`}>{AssetTransferAddress.fromPublicKeyHash(new H256(output.owner)).value}</Link> : "Unknown"
                                                }</Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="3">
                                                    Amount
                                                </Col>
                                                <Col md="9">
                                                    {output.amount}
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="3">
                                                    LockScriptHash
                                                </Col>
                                                <Col md="9">
                                                    {output.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ? "P2PKH" : <HexString text={output.lockScriptHash} />}
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="3">
                                                    Parameters
                                                </Col>
                                                <Col md="9">
                                                    <div className="text-area">
                                                        {_.map(output.parameters, (parameter, i) => {
                                                            return <div key={`transaction-paramter-${i}`}>{Buffer.from(parameter).toString("hex")}</div>
                                                        })}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <hr />
                                        </div>
                                    </Col>
                                </Row>
                            ])
                        })
                    }
                </div>
            ]
        );
    } else if (Type.isAssetMintTransactionDoc(transaction)) {
        const transactionDoc = transaction as AssetMintTransactionDoc;
        const metadata = Type.getMetadata(transactionDoc.data.metadata);
        return ([
            <Row key="details" className="mb-4">
                <Col lg="9">
                    <div className="data-set">
                        <Row>
                            <Col md="3">
                                Registrar
                            </Col>
                            <Col md="9">
                                {transactionDoc.data.registrar ? <Link to={`/addr-platform/${PlatformAddress.fromAccountId(transactionDoc.data.registrar).value}`}>{PlatformAddress.fromAccountId(transactionDoc.data.registrar).value}</Link> : "Not existed"}
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">
                                Nonce
                            </Col>
                            <Col md="9">
                                {transactionDoc.data.nonce}
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">
                                Owner
                            </Col>
                            <Col md="9">
                                {
                                    transactionDoc.data.output.owner ? <Link to={`/addr-asset/${AssetTransferAddress.fromPublicKeyHash(new H256(transactionDoc.data.output.owner)).value}`}>{AssetTransferAddress.fromPublicKeyHash(new H256(transactionDoc.data.output.owner)).value}</Link> : "Unknown"
                                }
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">
                                AssetType
                            </Col>
                            <Col md="9">
                                <img src={Type.getMetadata(transactionDoc.data.metadata).icon_url} className="icon mr-2" /> <HexString link={`/asset/0x${transactionDoc.data.output.assetType}`} text={transactionDoc.data.output.assetType} />
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">
                                Amount
                            </Col>
                            <Col md="9">
                                {transactionDoc.data.output.amount}
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">
                                LockScriptHash
                            </Col>
                            <Col md="9">
                                {transactionDoc.data.output.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ? "P2PKH" : <HexString text={transactionDoc.data.output.lockScriptHash} />}
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">
                                Parameters
                            </Col>
                            <Col md="9">
                                <div className="text-area">
                                    {_.map(transactionDoc.data.output.parameters, (parameter, i) => {
                                        return <div key={`transaction-heder-param-${i}`}>{Buffer.from(parameter).toString("hex")}</div>
                                    })}
                                </div>
                            </Col>
                        </Row>
                        <hr />
                    </div>
                </Col>
            </Row>,
            <Row key="metadata">
                <Col lg="9">
                    <h2>Metadata</h2>
                    <hr className="heading-hr" />
                </Col>
            </Row>,
            <Row key="metadata-detail">
                <Col lg="9">
                    <div className="data-set">
                        <Row>
                            <Col md="3">
                                Name
                            </Col>
                            <Col md="9">
                                {metadata.name ? metadata.name : "Unknown"}
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">
                                Description
                            </Col>
                            <Col md="9">
                                <div className="text-area">
                                    {metadata.description ? metadata.description : "Unknown"}
                                </div>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">
                                Icon
                            </Col>
                            <Col md="9">
                                <div className="text-area">
                                    {metadata.icon_url ? metadata.icon_url : "Unknown"}
                                </div>
                            </Col>
                        </Row>
                        <hr />
                    </div>
                </Col>
            </Row>
        ]);
    }
    return null;
}

const TransactionDetails = (props: Props) => {
    const { transaction } = props;

    return <div className="transaction-details">
        <Row>
            <Col lg="9">
                <h2>Details</h2>
                <hr className="heading-hr" />
            </Col>
        </Row>
        {
            getTransactionInfoByType(transaction)
        }
    </div>
};

export default TransactionDetails;
