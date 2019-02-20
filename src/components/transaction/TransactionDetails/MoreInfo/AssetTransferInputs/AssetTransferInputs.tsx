import { AssetTransferInputDoc } from "codechain-indexer-types";
import { Script } from "codechain-sdk/lib/core/classes";
import * as _ from "lodash";
import * as React from "react";
import { Link } from "react-router-dom";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import DataSet from "../../../../util/DataSet/DataSet";
import HexString from "../../../../util/HexString/HexString";
import { ImageLoader } from "../../../../util/ImageLoader/ImageLoader";

interface Props {
    inputs: AssetTransferInputDoc[];
    isBurn: boolean;
}

interface State {
    page: number;
}

export default class AssetTransferInputs extends React.Component<Props, State> {
    private itemsPerPage = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1
        };
    }
    public render() {
        const { inputs, isBurn } = this.props;
        const { page } = this.state;
        return (
            <div key="input">
                {_.map(inputs.slice(0, this.itemsPerPage * page), (input, index) => {
                    return this.renderInput(input, index);
                })}
                {this.itemsPerPage * page < inputs.length ? (
                    <Row>
                        <Col>
                            <div className="mt-small">
                                <button className="btn btn-primary w-100" onClick={this.loadMoreInput}>
                                    {isBurn ? "Load Burn" : "Load Input"}
                                </button>
                            </div>
                        </Col>
                    </Row>
                ) : null}
            </div>
        );
    }
    private renderInput = (input: AssetTransferInputDoc, index: number) => {
        const { isBurn } = this.props;
        return [
            <div key={`transaction-header-table-input-title-${index}`} className="mt-large">
                <h3>
                    {isBurn ? "Burn" : "Input"} #{index}
                </h3>
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
                                    <Link to={`/addr-asset/${input.prevOut.owner}`}>{input.prevOut.owner}</Link>
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
                                <div className="text-area">{new Script(input.lockScript).toTokens().join(" ")}</div>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col md="3">UnlockScript</Col>
                            <Col md="9">
                                <div className="text-area">{new Script(input.unlockScript).toTokens().join(" ")}</div>
                            </Col>
                        </Row>
                        <hr />
                        {input.prevOut.hash && [
                            <Row key="txHash">
                                <Col md="3">Prev Tx hash</Col>
                                <Col md="9">
                                    <HexString link={`/tx/0x${input.prevOut.hash}`} text={input.prevOut.hash} />
                                </Col>
                            </Row>,
                            <hr key="txHash-hr" />
                        ]}
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
    };
    private loadMoreInput = () => {
        this.setState({ page: this.state.page + 1 });
    };
}
