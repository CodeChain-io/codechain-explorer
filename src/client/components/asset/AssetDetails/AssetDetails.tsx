import * as React from "react";

import "./AssetDetails.scss"
import { AssetSchemeDoc, Type } from "../../../../db/DocType";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

interface OwnProps {
    assetType: string;
    assetScheme: AssetSchemeDoc;
}

const AssetDetails = (prop: OwnProps) => {
    const metadata = Type.getMetadata(prop.assetScheme.metadata);
    return <div className="asset-details">
        <Row>
            <Col>
                <h2>Details</h2>
                <hr className="heading-hr" />
            </Col>
        </Row>
        <Row>
            <Col>
                <div className="data-set">
                    <Row>
                        <Col md="3">
                            Name
                        </Col>
                        <Col md="9">
                            {metadata.name ? metadata.name : "None"}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="3">
                            Description
                        </Col>
                        <Col md="9">
                            <div className="text-area">
                                {metadata.description ? metadata.description : "None"}
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
                                {metadata.icon_url ? metadata.icon_url : "None"}
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="3">
                            Raw metadata
                            </Col>
                        <Col md="9">
                            <div className="text-area">
                                {prop.assetScheme.metadata}
                            </div>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="3">
                            Registrar
                        </Col>
                        <Col md="9">
                            {prop.assetScheme.registrar ? <Link to={`/addr-platform/${prop.assetScheme.registrar}`}>{prop.assetScheme.registrar}</Link> : "None"}
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col md="3">
                            Total Supply
                        </Col>
                        <Col md="9">
                            {prop.assetScheme.amount ? prop.assetScheme.amount.toLocaleString() : 0}
                        </Col>
                    </Row>
                    <hr />
                </div>
            </Col>
        </Row>
    </div>
};

export default AssetDetails;
