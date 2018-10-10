import * as React from "react";
import { Col, Row } from "reactstrap";

import { CodeChainData } from "../../../request/RequestCodeChainStatus";
import DataSet from "../../util/DataSet/DataSet";
import "./ChainInfo.scss";

interface Props {
    chainInfo: CodeChainData;
}

class ChainInfo extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { chainInfo } = this.props;
        return (
            <div className="chain-info">
                <div>
                    <h2>CodeChain Information</h2>
                    <hr className="heading-hr" />
                </div>
                <DataSet isStatus={true}>
                    <div className="one-line-data-set">
                        <div>Network ID</div>
                        <div>{chainInfo.networkId}</div>
                    </div>
                    <hr />
                    <div className="one-line-data-set">
                        <div>Version</div>
                        <div>v{chainInfo.nodeVersion}</div>
                    </div>
                    <hr />
                    <div className="one-line-data-set">
                        <div>Git hash</div>
                        <div>
                            <a
                                href={`https://github.com/CodeChain-io/codechain/commit/${chainInfo.commitHash}`}
                                target="_black"
                            >
                                {chainInfo.commitHash}
                            </a>
                        </div>
                    </div>
                    <hr />
                    <div className="one-line-data-set">
                        <div>Peer count</div>
                        <div>{chainInfo.peerCount}</div>
                    </div>
                    <hr />
                    <Row>
                        <Col md="12">Peer list</Col>
                        <Col md="12">
                            <div className="text-area text-left">{chainInfo.peers.join(", ")}</div>
                        </Col>
                    </Row>
                    <hr />
                    <div className="one-line-data-set">
                        <div>White list status</div>
                        <div>{chainInfo.whiteList.enabled ? "enabled" : "disabled"}</div>
                    </div>
                    <hr />
                    <Row>
                        <Col md="12">White list</Col>
                        <Col md="12">
                            <div className="text-area text-left">{chainInfo.whiteList.list.join(", ")}</div>
                        </Col>
                    </Row>
                    <hr />
                    <div className="one-line-data-set">
                        <div>Black list status</div>
                        <div>{chainInfo.blackList.enabled ? "enabled" : "disabled"}</div>
                    </div>
                    <hr />
                    <Row>
                        <Col md="12">Black list</Col>
                        <Col md="12">
                            <div className="text-area text-left">{chainInfo.blackList.list.join(", ")}</div>
                        </Col>
                    </Row>
                    <hr />
                </DataSet>
            </div>
        );
    }
}

export default ChainInfo;
