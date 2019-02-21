import { ChangeAssetSchemeTransactionDoc } from "codechain-indexer-types";
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
            <hr key="assetType-hr" />
        ];
    }
}
