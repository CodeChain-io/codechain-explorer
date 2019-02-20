import * as _ from "lodash";
import * as React from "react";

import { connect, Dispatch } from "react-redux";
import { Col, Row } from "reactstrap";
import { RootState } from "../../../redux/actions";

import { Buffer } from "buffer";
import { TransactionDoc } from "codechain-indexer-types";
import { Script } from "codechain-sdk/lib/core/classes";
import { Link } from "react-router-dom";
import * as Metadata from "../../../utils/Metadata";
import { getLockScriptName } from "../../../utils/Transactions";
import DataSet from "../../util/DataSet/DataSet";
import HexString from "../../util/HexString/HexString";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";
import CommonDetails from "./CommonDetails/CommonDetails";
import DetailsByType from "./DetailsByType/DetailsByType";
import "./TransactionDetails.scss";

interface OwnProps {
    transaction: TransactionDoc;
    moveToSectionRef?: string;
}

interface StateProps {
    moveToSectionRef?: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

interface State {
    pageForInput: number;
    pageForOutput: number;
    pageForBurn: number;
}

type Props = OwnProps & StateProps & DispatchProps;

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
        const { transaction } = this.props;
        return (
            <div className="transaction-details">
                <Row>
                    <Col lg="12">
                        <h2>Details</h2>
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                {this.renderTransactionInfo(transaction)}
                {this.renderMoreInfoByType(transaction)}
            </div>
        );
    }

    private renderTransactionInfo = (transaction: TransactionDoc) => {
        return (
            <Row key="details">
                <Col lg="12">
                    <DataSet>
                        <CommonDetails tx={transaction} />
                        <DetailsByType tx={transaction} />
                    </DataSet>
                </Col>
            </Row>
        );
    };

    private renderMoreInfoByType = (transaction: TransactionDoc) => {
        const { pageForBurn, pageForOutput, pageForInput } = this.state;
        if (transaction.type === "transferAsset") {
            return [
                <div key="input">
                    {_.map(
                        transaction.transferAsset.inputs.slice(0, this.itemsPerPage * pageForInput),
                        (input, index) => {
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
                                                <Col md="9">{input.prevOut.quantity.toLocaleString()}</Col>
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
                                                <Col md="3">Prev Tx tracker </Col>
                                                <Col md="9">
                                                    0x
                                                    {input.prevOut.tracker}
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
                        }
                    )}
                    {this.itemsPerPage * pageForInput < transaction.transferAsset.inputs.length ? (
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
                    {_.map(transaction.transferAsset.burns.slice(0, this.itemsPerPage * pageForBurn), (burn, index) => {
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
                                            <Col md="9">{burn.prevOut.quantity.toLocaleString()}</Col>
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
                                            <Col md="3">Prev Tx tracker</Col>
                                            <Col md="9">
                                                0x
                                                {burn.prevOut.tracker}
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
                    {this.itemsPerPage * pageForBurn < transaction.transferAsset.burns.length ? (
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
                    {_.map(
                        transaction.transferAsset.outputs.slice(0, this.itemsPerPage * pageForOutput),
                        (output, index) => {
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
                                                <Col md="9">{output.quantity.toLocaleString()}</Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="3">LockScriptHash</Col>
                                                <Col md="9">{getLockScriptName(output.lockScriptHash)}</Col>
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
                        }
                    )}
                    {this.itemsPerPage * pageForOutput < transaction.transferAsset.outputs.length ? (
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
        } else if (transaction.type === "mintAsset") {
            const metadata = Metadata.parseMetadata(transaction.mintAsset.metadata);
            return [
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
                                    <div className="text-area">{transaction.mintAsset.metadata}</div>
                                </Col>
                            </Row>
                            <hr />
                        </DataSet>
                    </Col>
                </Row>
            ];
        } else if (transaction.type === "composeAsset") {
            return [
                <div key="input">
                    {_.map(
                        transaction.composeAsset.inputs.slice(0, this.itemsPerPage * pageForInput),
                        (input, index) => {
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
                                                <Col md="9">{input.prevOut.quantity.toLocaleString()}</Col>
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
                                                <Col md="3">Prev Tx tracker</Col>
                                                <Col md="9">
                                                    0x
                                                    {input.prevOut.tracker}
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
                        }
                    )}
                    {this.itemsPerPage * pageForInput < transaction.composeAsset.inputs.length ? (
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
                <div key="output">
                    <div
                        className="mt-large"
                        ref={(re: any) => {
                            this.refList[`output-0`] = re;
                        }}
                    >
                        <h3>Output</h3>
                        <hr className="heading-hr" />
                    </div>
                    <Row>
                        <Col lg="12">
                            <DataSet>
                                <Row>
                                    <Col md="3">AssetType</Col>
                                    <Col md="9">
                                        <ImageLoader
                                            size={18}
                                            data={transaction.composeAsset.assetType}
                                            className="mr-2"
                                            isAssetImage={true}
                                        />
                                        <HexString
                                            link={`/asset/0x${transaction.composeAsset.assetType}`}
                                            text={transaction.composeAsset.assetType}
                                        />
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">Recipient</Col>
                                    <Col md="9">
                                        {transaction.composeAsset.recipient ? (
                                            <Link to={`/addr-asset/${transaction.composeAsset.recipient}`}>
                                                {transaction.composeAsset.recipient}
                                            </Link>
                                        ) : (
                                            "Unknown"
                                        )}
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">Quantity</Col>
                                    <Col md="9">{transaction.composeAsset.supply}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">LockScriptHash</Col>
                                    <Col md="9">{getLockScriptName(transaction.composeAsset.lockScriptHash)}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">Parameters</Col>
                                    <Col md="9">
                                        <div className="text-area">
                                            {_.map(transaction.composeAsset.parameters, (parameter, i) => {
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
                </div>
            ];
        } else if (transaction.type === "decomposeAsset") {
            return [
                <div key="input">
                    <div
                        className="mt-large"
                        ref={(re: any) => {
                            this.refList[`input-0`] = re;
                        }}
                    >
                        <h3>Input</h3>
                        <hr className="heading-hr" />
                    </div>
                    <Row>
                        <Col lg="12">
                            <DataSet>
                                <Row>
                                    <Col md="3">AssetType</Col>
                                    <Col md="9">
                                        <ImageLoader
                                            className="mr-2"
                                            size={18}
                                            data={transaction.decomposeAsset.input.prevOut.assetType}
                                            isAssetImage={true}
                                        />
                                        <HexString
                                            link={`/asset/0x${transaction.decomposeAsset.input.prevOut.assetType}`}
                                            text={transaction.decomposeAsset.input.prevOut.assetType}
                                        />
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">Owner</Col>
                                    <Col md="9">
                                        {transaction.decomposeAsset.input.prevOut.owner ? (
                                            <Link to={`/addr-asset/${transaction.decomposeAsset.input.prevOut.owner}`}>
                                                {transaction.decomposeAsset.input.prevOut.owner}
                                            </Link>
                                        ) : (
                                            "Unknown"
                                        )}
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">Quantity</Col>
                                    <Col md="9">{transaction.decomposeAsset.input.prevOut.quantity}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">LockScript</Col>
                                    <Col md="9">
                                        <div className="text-area">
                                            {new Script(transaction.decomposeAsset.input.lockScript)
                                                .toTokens()
                                                .join(" ")}
                                        </div>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">UnlockScript</Col>
                                    <Col md="9">
                                        <div className="text-area">
                                            {new Script(transaction.decomposeAsset.input.unlockScript)
                                                .toTokens()
                                                .join(" ")}
                                        </div>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">Prev Tx tracker</Col>
                                    <Col md="9">
                                        0x
                                        {transaction.decomposeAsset.input.prevOut.tracker}
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md="3">Prev Tx Index</Col>
                                    <Col md="9">{transaction.decomposeAsset.input.prevOut.index.toLocaleString()}</Col>
                                </Row>
                                <hr />
                            </DataSet>
                        </Col>
                    </Row>
                </div>,
                <div key="output">
                    {_.map(
                        transaction.decomposeAsset.outputs.slice(0, this.itemsPerPage * pageForOutput),
                        (output, index) => {
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
                                                <Col md="9">{output.quantity.toLocaleString()}</Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                                <Col md="3">LockScriptHash</Col>
                                                <Col md="9">{getLockScriptName(output.lockScriptHash)}</Col>
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
                        }
                    )}
                    {this.itemsPerPage * pageForOutput < transaction.decomposeAsset.outputs.length ? (
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
