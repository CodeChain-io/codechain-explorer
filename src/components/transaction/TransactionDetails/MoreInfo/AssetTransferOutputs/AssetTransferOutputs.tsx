import { AssetTransferOutputDoc } from "codechain-indexer-types";
import * as _ from "lodash";
import * as React from "react";
import { Link } from "react-router-dom";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import { getLockScriptName } from "../../../../../utils/Transactions";
import DataSet from "../../../../util/DataSet/DataSet";
import HexString from "../../../../util/HexString/HexString";
import { ImageLoader } from "../../../../util/ImageLoader/ImageLoader";

interface Props {
    outputs: AssetTransferOutputDoc[];
}

interface State {
    page: number;
}

export default class AssetTransferOutputs extends React.Component<Props, State> {
    private itemsPerPage = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1
        };
    }
    public render() {
        const { outputs } = this.props;
        const { page } = this.state;
        return (
            <div key="output">
                {_.map(outputs.slice(0, this.itemsPerPage * page), (output, index) => {
                    return this.renderOutput(output, index);
                })}
                {this.itemsPerPage * page < outputs.length ? (
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
        );
    }

    public renderOutput = (output: AssetTransferOutputDoc, index: number) => {
        return [
            <div key={`transaction-header-table-output-title-${index}`} className="mt-large">
                <h3>Output #{index}</h3>
                <hr className="heading-hr" />
            </div>,
            <Row key={`transaction-header-table-output-details-${index}`}>
                <Col lg="12">
                    <DataSet>
                        <Row>
                            <Col md="3">AssetType</Col>
                            <Col md="9">
                                <ImageLoader size={18} data={output.assetType} className="mr-2" isAssetImage={true} />
                                <HexString link={`/asset/0x${output.assetType}`} text={output.assetType} />
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
    };

    private loadMoreOutput = () => {
        this.setState({ page: this.state.page + 1 });
    };
}
