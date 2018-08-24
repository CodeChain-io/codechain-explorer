import * as React from "react";
import { Row, Col } from "reactstrap";

import "./ChainInfo.scss";

class ChainInfo extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render() {
        return (
            <div className="chain-info">
                <div>
                    <h2>CodeChain Information</h2>
                    <hr className="heading-hr" />
                </div>
                <div className="data-set-for-status">
                    <div className="one-line-data-set">
                        <div>
                            Network ID
                        </div>
                        <div>
                            TC
                        </div>
                    </div>
                    <hr />
                    <div className="one-line-data-set">
                        <div>
                            Version
                        </div>
                        <div>
                            v0.0.1
                        </div>
                    </div>
                    <hr />
                    <div className="one-line-data-set">
                        <div>
                            Git hash
                        </div>
                        <div>
                            hashhash...
                        </div>
                    </div>
                    <hr />
                    <div className="one-line-data-set">
                        <div>
                            Git hash
                        </div>
                        <div>
                            hashhash...
                        </div>
                    </div>
                    <hr />
                    <Row>
                        <Col md="12">
                            Peer count
                        </Col>
                        <Col md="12">
                            <div className="text-area text-left">
                                area
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="12">
                            Peer list
                        </Col>
                        <Col md="12">
                            <div className="text-area text-left">
                                area
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="12">
                            White list
                        </Col>
                        <Col md="12">
                            <div className="text-area text-left">
                                area
                            </div>
                        </Col>
                    </Row>
                    <hr />
                </div>
            </div>
        )
    }
};

export default ChainInfo;
