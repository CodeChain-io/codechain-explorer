import * as _ from "lodash";
import * as React from "react";

import { connect, Dispatch } from "react-redux";
import { Col, Row } from "reactstrap";
import { RootState } from "../../../redux/actions";

import { Buffer } from "buffer";
import { AssetMintTransactionDoc, AssetTransferTransactionDoc, TransactionDoc } from "codechain-es/lib/types";
import { Type } from "codechain-es/lib/utils";
import { Script } from "codechain-sdk/lib/core/classes";
import { Link } from "react-router-dom";
import DataSet from "../../util/DataSet/DataSet";
import HexString from "../../util/HexString/HexString";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";
import { StatusBadge } from "../../util/StatusBadge/StatusBadge";
import { TypeBadge } from "../../util/TypeBadge/TypeBadge";
import "./TransactionDetails.scss";

interface TransactionResult {
    transaction: TransactionDoc;
    status: string;
    timestamp?: number;
}

interface Props {
    transactionResult: TransactionResult;
    moveToSectionRef?: string;
    dispatch: Dispatch;
}

interface State {
    pageForInput: number;
    pageForOutput: number;
    pageForBurn: number;
}

class TransactionDetailsInternal extends React.Component<Props, State> {
    private itemsPerPage = 6;
    private refList: any = {};
    constructor(props: Props) {
        super(props);
        this.state = {
            pageForInput: 1,
            pageForOutput: 1,
            pageForBurn: 1
        };
    }

    public componentDidUpdate() {
        if (this.props.moveToSectionRef) {
            this.scrollToRef();
        }
    }

    public render() {
        const { transactionResult } = this.props;
        return (
            <div className="transaction-details">
                <Row>
                    <Col lg="12">
                        <h2>Details</h2>
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                {this.getTransactionInfoByType(
                    transactionResult.transaction,
                    transactionResult.status,
                    transactionResult.timestamp
                )}
            </div>
        );
    }

    private getLockScriptName = (lockScriptHash: string) => {
        switch (lockScriptHash) {
            case "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3":
                return "P2PKH(0xf42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3)";
            case "41a872156efc1dbd45a85b49896e9349a4e8f3fb1b8f3ed38d5e13ef675bcd5a":
                return "P2PKHBurn(0x41a872156efc1dbd45a85b49896e9349a4e8f3fb1b8f3ed38d5e13ef675bcd5a)";
        }
        return `0x${lockScriptHash}`;
    };

    private getTransactionInfoByType = (transaction: TransactionDoc, status: string, pendingDuration?: number) => {
        const { pageForBurn, pageForOutput, pageForInput } = this.state;
        if (Type.isAssetTransferTransactionDoc(transaction)) {
            const transactionDoc = transaction as AssetTransferTransactionDoc;
            return [
                <Row key="details">
                    <Col lg="12">
                        <DataSet>
                            <Row>
                                <Col md="3">Action</Col>
                                <Col md="9">
                                    <TypeBadge transaction={transaction} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Parcel Hash</Col>
                                <Col md="9">
                                    <HexString
                                        text={transactionDoc.data.parcelHash}
                                        link={`/parcel/0x${transactionDoc.data.parcelHash}`}
                                    />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Transaction Index</Col>
                                <Col md="9">{transactionDoc.data.transactionIndex.toLocaleString()}</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">NetworkID</Col>
                                <Col md="9">{transactionDoc.data.networkId}</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Nonce</Col>
                                <Col md="9">{transactionDoc.data.nonce.toLocaleString()}</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Status</Col>
                                <Col md="9">
                                    <StatusBadge status={status} timestamp={pendingDuration} />
                                </Col>
                            </Row>
                            <hr />
                            {status === "confirmed"
                                ? [
                                      <Row key="invoice-row">
                                          <Col md="3">Invoice</Col>
                                          <Col md="9">
                                              {transactionDoc.data.invoice
                                                  ? "Success"
                                                  : `Fail - ${transactionDoc.data.errorType}`}
                                          </Col>
                                      </Row>,
                                      <hr key="invoice-hr" />
                                  ]
                                : null}
                            <Row>
                                <Col md="3"># of Input</Col>
                                <Col md="9">{transactionDoc.data.inputs.length.toLocaleString()}</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3"># of Output</Col>
                                <Col md="9">{transactionDoc.data.outputs.length.toLocaleString()}</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3"># of Burn</Col>
                                <Col md="9">{transactionDoc.data.burns.length.toLocaleString()}</Col>
                            </Row>
                            <hr />
                        </DataSet>
                    </Col>
                </Row>,
                <div key="input">
                    {_.map(transactionDoc.data.inputs.slice(0, this.itemsPerPage * pageForInput), (input, index) => {
                        return [
                            <div
                                key={`transaction-header-table-input-title-${index}`}
                                className="mt-large"
                                ref={(re: any) => {
                                    this.refList[`input-${index}`] = re;
                                }}
                            >
                                <h3>Input #{index}</h3>
                                <hr className="heading-hr" />
                            </div>,
                            <Row key={`transaction-header-table-input-detail-${index}`}>
                                <Col lg="12">
                                    <DataSet>
                                        <Row>
                                            <Col md="3">AssetType</Col>
                                            <Col md="9">
                                                <ImageLoader
                                                    className="mr-2"
                                                    size={18}
                                                    data={input.prevOut.assetType}
                                                    isAssetImage={true}
                                                />
                                                <HexString
                                                    link={`/asset/0x${input.prevOut.assetType}`}
                                                    text={input.prevOut.assetType}
                                                />
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Owner</Col>
                                            <Col md="9">
                                                {input.prevOut.owner ? (
                                                    <Link to={`/addr-asset/${input.prevOut.owner}`}>
                                                        {input.prevOut.owner}
                                                    </Link>
                                                ) : (
                                                    "Unknown"
                                                )}
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Quantity</Col>
                                            <Col md="9">{input.prevOut.amount.toLocaleString()}</Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">LockScript</Col>
                                            <Col md="9">
                                                <div className="text-area">
                                                    {new Script(input.lockScript).toTokens().join(" ")}
                                                </div>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">UnlockScript</Col>
                                            <Col md="9">
                                                <div className="text-area">
                                                    {new Script(input.unlockScript).toTokens().join(" ")}
                                                </div>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Prev Tx</Col>
                                            <Col md="9">
                                                <HexString
                                                    link={`/tx/0x${input.prevOut.transactionHash}`}
                                                    text={input.prevOut.transactionHash}
                                                />
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Prev Tx Index</Col>
                                            <Col md="9">{input.prevOut.index.toLocaleString()}</Col>
                                        </Row>
                                        <hr />
                                    </DataSet>
                                </Col>
                            </Row>
                        ];
                    })}
                    {this.itemsPerPage * pageForInput < transactionDoc.data.inputs.length ? (
                        <Row>
                            <Col>
                                <div className="mt-small">
                                    <button className="btn btn-primary w-100" onClick={this.loadMoreInput}>
                                        Load Input
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    ) : null}
                </div>,
                <div key="burn">
                    {_.map(transactionDoc.data.burns.slice(0, this.itemsPerPage * pageForBurn), (burn, index) => {
                        return [
                            <div
                                key={`transaction-header-table-burn-title-${index}`}
                                className="mt-large"
                                ref={(re: any) => {
                                    this.refList[`burn-${index}`] = re;
                                }}
                            >
                                <h3>Burn #{index}</h3>
                                <hr className="heading-hr" />
                            </div>,
                            <Row key={`transaction-header-table-burn-detail-${index}`}>
                                <Col lg="12">
                                    <DataSet>
                                        <Row>
                                            <Col md="3">AssetType</Col>
                                            <Col md="9">
                                                <ImageLoader
                                                    className="mr-2"
                                                    size={18}
                                                    data={burn.prevOut.assetType}
                                                    isAssetImage={true}
                                                />
                                                <HexString
                                                    link={`/asset/0x${burn.prevOut.assetType}`}
                                                    text={burn.prevOut.assetType}
                                                />
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Owner</Col>
                                            <Col md="9">
                                                {burn.prevOut.owner ? (
                                                    <Link to={`/addr-asset/${burn.prevOut.owner}`}>
                                                        {burn.prevOut.owner}
                                                    </Link>
                                                ) : (
                                                    "Unknown"
                                                )}
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Quantity</Col>
                                            <Col md="9">{burn.prevOut.amount.toLocaleString()}</Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">LockScript</Col>
                                            <Col md="9">
                                                <div className="text-area">
                                                    {new Script(burn.lockScript).toTokens().join(" ")}
                                                </div>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">UnlockScript</Col>
                                            <Col md="9">
                                                <div className="text-area">
                                                    {new Script(burn.unlockScript).toTokens().join(" ")}
                                                </div>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Prev Tx</Col>
                                            <Col md="9">
                                                <HexString
                                                    link={`/tx/0x${burn.prevOut.transactionHash}`}
                                                    text={burn.prevOut.transactionHash}
                                                />
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Prev Tx Index</Col>
                                            <Col md="9">{burn.prevOut.index.toLocaleString()}</Col>
                                        </Row>
                                        <hr />
                                    </DataSet>
                                </Col>
                            </Row>
                        ];
                    })}
                    {this.itemsPerPage * pageForBurn < transactionDoc.data.burns.length ? (
                        <Row>
                            <Col>
                                <div className="mt-small">
                                    <button className="btn btn-primary w-100" onClick={this.loadMoreBurn}>
                                        Load Burn
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    ) : null}
                </div>,
                <div key="output">
                    {_.map(transactionDoc.data.outputs.slice(0, this.itemsPerPage * pageForOutput), (output, index) => {
                        return [
                            <div
                                key={`transaction-header-table-output-title-${index}`}
                                className="mt-large"
                                ref={(re: any) => {
                                    this.refList[`output-${index}`] = re;
                                }}
                            >
                                <h3>Output #{index}</h3>
                                <hr className="heading-hr" />
                            </div>,
                            <Row key={`transaction-header-table-output-details-${index}`}>
                                <Col lg="12">
                                    <DataSet>
                                        <Row>
                                            <Col md="3">AssetType</Col>
                                            <Col md="9">
                                                <ImageLoader
                                                    size={18}
                                                    data={output.assetType}
                                                    className="mr-2"
                                                    isAssetImage={true}
                                                />
                                                <HexString
                                                    link={`/asset/0x${output.assetType}`}
                                                    text={output.assetType}
                                                />
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Owner</Col>
                                            <Col md="9">
                                                {output.owner ? (
                                                    <Link to={`/addr-asset/${output.owner}`}>{output.owner}</Link>
                                                ) : (
                                                    "Unknown"
                                                )}
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Quantity</Col>
                                            <Col md="9">{output.amount.toLocaleString()}</Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">LockScriptHash</Col>
                                            <Col md="9">{this.getLockScriptName(output.lockScriptHash)}</Col>
                                        </Row>
                                        <hr />
                                        <Row>
                                            <Col md="3">Parameters</Col>
                                            <Col md="9">
                                                <div className="text-area">
                                                    {_.map(output.parameters, (parameter, i) => {
                                                        return (
                                                            <div key={`transaction-paramter-${i}`}>
                                                                {Buffer.from(parameter).toString("hex")}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </Col>
                                        </Row>
                                        <hr />
                                    </DataSet>
                                </Col>
                            </Row>
                        ];
                    })}
                    {this.itemsPerPage * pageForOutput < transactionDoc.data.outputs.length ? (
                        <Row>
                            <Col>
                                <div className="mt-small">
                                    <button className="btn btn-primary w-100" onClick={this.loadMoreOutput}>
                                        Load Output
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    ) : null}
                </div>
            ];
        } else if (Type.isAssetMintTransactionDoc(transaction)) {
            const transactionDoc = transaction as AssetMintTransactionDoc;
            const metadata = Type.getMetadata(transactionDoc.data.metadata);
            return [
                <Row key="details">
                    <Col lg="12">
                        <DataSet>
                            <Row>
                                <Col md="3">Action</Col>
                                <Col md="9">
                                    <TypeBadge transaction={transaction} />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Parcel Hash</Col>
                                <Col md="9">
                                    <HexString
                                        text={transactionDoc.data.parcelHash}
                                        link={`/parcel/0x${transactionDoc.data.parcelHash}`}
                                    />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Transaction Index</Col>
                                <Col md="9">{transactionDoc.data.transactionIndex.toLocaleString()}</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">NetworkID</Col>
                                <Col md="9">{transactionDoc.data.networkId}</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Nonce</Col>
                                <Col md="9">{transactionDoc.data.nonce}</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Status</Col>
                                <Col md="9">
                                    <StatusBadge status={status} timestamp={pendingDuration} />
                                </Col>
                            </Row>
                            <hr />
                            {status === "confirmed"
                                ? [
                                      <Row key="invoice-row">
                                          <Col md="3">Invoice</Col>
                                          <Col md="9">
                                              {transactionDoc.data.invoice
                                                  ? "Success"
                                                  : `Fail - ${transactionDoc.data.errorType}`}
                                          </Col>
                                      </Row>,
                                      <hr key="invoice-hr" />
                                  ]
                                : null}
                            <Row>
                                <Col md="3">LockScriptHash</Col>
                                <Col md="9">{this.getLockScriptName(transactionDoc.data.output.lockScriptHash)}</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Parameters</Col>
                                <Col md="9">
                                    <div className="text-area">
                                        {_.map(transactionDoc.data.output.parameters, (parameter, i) => {
                                            return (
                                                <div key={`transaction-heder-param-${i}`}>
                                                    {Buffer.from(parameter).toString("hex")}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">AssetType</Col>
                                <Col md="9">
                                    <ImageLoader
                                        data={transactionDoc.data.output.assetType}
                                        size={18}
                                        className="mr-2"
                                        isAssetImage={true}
                                    />
                                    <HexString
                                        link={`/asset/0x${transactionDoc.data.output.assetType}`}
                                        text={transactionDoc.data.output.assetType}
                                    />
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Quantity</Col>
                                <Col md="9">
                                    {transactionDoc.data.output.amount
                                        ? transactionDoc.data.output.amount.toLocaleString()
                                        : 0}
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Registrar</Col>
                                <Col md="9">
                                    {transactionDoc.data.registrar ? (
                                        <Link to={`/addr-platform/${transactionDoc.data.registrar}`}>
                                            {transactionDoc.data.registrar}
                                        </Link>
                                    ) : (
                                        "None"
                                    )}
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Owner</Col>
                                <Col md="9">
                                    {transactionDoc.data.output.owner ? (
                                        <Link to={`/addr-asset/${transactionDoc.data.output.owner}`}>
                                            {transactionDoc.data.output.owner}
                                        </Link>
                                    ) : (
                                        "Unknown"
                                    )}
                                </Col>
                            </Row>
                            <hr />
                        </DataSet>
                    </Col>
                </Row>,
                <Row key="metadata">
                    <Col lg="12" className="mt-large">
                        <h2>Metadata</h2>
                        <hr className="heading-hr" />
                    </Col>
                </Row>,
                <Row key="metadata-detail">
                    <Col lg="12">
                        <DataSet>
                            <Row>
                                <Col md="3">Name</Col>
                                <Col md="9">{metadata.name ? metadata.name : "None"}</Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Description</Col>
                                <Col md="9">
                                    <div className="text-area">
                                        {metadata.description ? metadata.description : "None"}
                                    </div>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Icon</Col>
                                <Col md="9">
                                    <div className="text-area">{metadata.icon_url ? metadata.icon_url : "None"}</div>
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="3">Raw data</Col>
                                <Col md="9">
                                    <div className="text-area">{transactionDoc.data.metadata}</div>
                                </Col>
                            </Row>
                            <hr />
                        </DataSet>
                    </Col>
                </Row>
            ];
        }
        return null;
    };

    private scrollToRef = () => {
        const ref = this.props.moveToSectionRef;
        if (ref) {
            const domNode = this.refList[ref];
            if (domNode) {
                if (window.innerWidth <= 991) {
                    window.scrollTo(0, domNode.offsetTop - 120);
                } else {
                    window.scrollTo(0, domNode.offsetTop - 70);
                }
            }
        }
        this.props.dispatch({
            type: "MOVE_TO_SECTION",
            data: undefined
        });
    };

    private loadMoreInput = () => {
        this.setState({ pageForInput: this.state.pageForInput + 1 });
    };

    private loadMoreBurn = () => {
        this.setState({ pageForBurn: this.state.pageForBurn + 1 });
    };

    private loadMoreOutput = () => {
        this.setState({ pageForOutput: this.state.pageForOutput + 1 });
    };
}

const TransactionDetails = connect((state: RootState) => {
    const { moveToSectionRef } = state.appReducer;
    return {
        moveToSectionRef
    };
})(TransactionDetailsInternal);

export default TransactionDetails;
