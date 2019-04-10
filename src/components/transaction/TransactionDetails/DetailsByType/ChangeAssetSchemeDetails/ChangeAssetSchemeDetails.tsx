import { ChangeAssetSchemeTransactionDoc } from "codechain-indexer-types";
import * as _ from "lodash";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import HexString from "../../../../util/HexString/HexString";
import { ImageLoader } from "../../../../util/ImageLoader/ImageLoader";

interface Props {
    tx: ChangeAssetSchemeTransactionDoc;
}

export default class ChangeAssetSchemeDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        return [
            <Row key="shardId">
                <Col md="3">ShardId</Col>
                <Col md="9">{tx.changeAssetScheme.shardId}</Col>
            </Row>,
            <hr key="shardId-hr" />,
            <Row key="registrar">
                <Col md="3">Registrar</Col>
                <Col md="9">{tx.changeAssetScheme.registrar ? tx.changeAssetScheme.registrar : "None"}</Col>
            </Row>,
            <hr key="registrar-hr" />,
            <Row key="allowedScriptHashes">
                <Col md="3">AllowedScriptHashes</Col>
                <Col md="9">
                    {tx.changeAssetScheme.allowedScriptHashes.length !== 0 ? (
                        <div className="text-area">
                            {_.map(tx.changeAssetScheme.allowedScriptHashes, (allowedScriptHash, i) => {
                                return <div key={`transaction-heder-param-${i}`}>{allowedScriptHash}</div>;
                            })}
                        </div>
                    ) : (
                        "None"
                    )}
                </Col>
            </Row>,
            <hr key="allowedScriptHashes-hr" />,
            <Row key="approvals">
                <Col md="3">Approvals</Col>
                <Col md="9">
                    {tx.changeAssetScheme.approvals.length !== 0 ? (
                        <div className="text-area">
                            {_.map(tx.changeAssetScheme.approvals, (approval, i) => {
                                return <div key={`transaction-heder-param-${i}`}>{approval}</div>;
                            })}
                        </div>
                    ) : (
                        "None"
                    )}
                </Col>
            </Row>,
            <hr key="approvals-hr" />,
            <Row key="assetType">
                <Col md="3">AssetType</Col>
                <Col md="9">
                    <ImageLoader data={tx.changeAssetScheme.assetType} size={18} className="mr-2" isAssetImage={true} />
                    <HexString
                        link={`/asset/0x${tx.changeAssetScheme.assetType}`}
                        text={tx.changeAssetScheme.assetType}
                    />
                </Col>
            </Row>,
            <hr key="assetType-hr" />,
            <Row key="metadata">
                <Col md="3">Metadata</Col>
                <Col md="9">
                    <div className="text-area">{tx.changeAssetScheme.metadata}</div>
                </Col>
            </Row>,
            <hr key="metadata-hr" />
        ];
    }
}
