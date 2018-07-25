import * as React from "react";

import "./AssetDetails.scss"
import { AssetSchemeDoc, Type } from "../../../db/DocType";
import { Row, Col } from "reactstrap";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";
import { Link } from "react-router-dom";

interface OwnProps {
    assetType: string;
    assetScheme: AssetSchemeDoc;
}

const AssetDetails = (prop: OwnProps) => {
    const metadata = Type.getMetadata(prop.assetScheme.metadata);
    return <div className="asset-details">
        <Row>
            <Col md="2">{metadata.icon_url ? <img className="asset-icon" src={metadata.icon_url} /> : "Unknown"}</Col>
            <Col md="10">
                <h1>{metadata.name ? metadata.name : "Unknown"}</h1>
                {metadata.description ? metadata.description : "No description"}
            </Col>
        </Row>
        <div className="line" />
        <Row>
            <Col md="2">
                AssetType
            </Col>
            <Col md="10">
                {prop.assetType}
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Total Supply
            </Col>
            <Col md="10">
                {prop.assetScheme.amount}
            </Col>
        </Row>
        <Row>
            <Col md="2">
                Registrar
            </Col>
            <Col md="10">
                {prop.assetScheme.registrar ? <Link to={`/addr-platform/${PlatformAddress.fromAccountId(prop.assetScheme.registrar).value}`}>{PlatformAddress.fromAccountId(prop.assetScheme.registrar).value}</Link> : "Not existed"}
            </Col>
        </Row>
    </div>
};

export default AssetDetails;
