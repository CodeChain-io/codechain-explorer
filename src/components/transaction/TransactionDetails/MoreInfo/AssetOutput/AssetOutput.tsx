import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import * as Metadata from "../../../../../utils/Metadata";
import DataSet from "../../../../util/DataSet/DataSet";

interface Props {
    asset: Asset;
}

export interface Asset {
    networkId: string;
    shardId: number;
    metadata: string;
    approver: string | null;
    registrar: string | null;
    allowedScriptHashes: string[];
    approvals: string[];
    lockScriptHash: string;
    parameters: string[];
    supply: string;
    assetName?: string;
    assetType: string;
    recipient: string;
}

export default class AssetOutput extends React.Component<Props, any> {
    public render() {
        const { asset } = this.props;
        const metadata = Metadata.parseMetadata(asset.metadata);
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
                                <div className="text-area">{metadata.description ? metadata.description : "None"}</div>
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
                                <div className="text-area">{asset.metadata}</div>
                            </Col>
                        </Row>
                        <hr />
                    </DataSet>
                </Col>
            </Row>
        ];
    }
}
