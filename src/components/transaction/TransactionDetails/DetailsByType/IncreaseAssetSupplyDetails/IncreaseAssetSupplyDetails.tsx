import { IncreaseAssetSupplyDoc } from "codechain-indexer-types";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import HexString from "../../../../util/HexString/HexString";
import { ImageLoader } from "../../../../util/ImageLoader/ImageLoader";

interface Props {
    tx: IncreaseAssetSupplyDoc;
}

export default class IncreaseAssetSupplyDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        return [
            <Row key="assetType">
                <Col md="3">AssetType</Col>
                <Col md="9">
                    <ImageLoader
                        data={tx.increaseAssetSupply.assetType}
                        size={18}
                        className="mr-2"
                        isAssetImage={true}
                    />
                    <HexString
                        link={`/asset/0x${tx.increaseAssetSupply.assetType}`}
                        text={tx.increaseAssetSupply.assetType}
                    />
                </Col>
            </Row>,
            <hr key="assetType-hr" />,
            <Row key="supply">
                <Col md="3">Supply</Col>
                <Col md="9">{tx.increaseAssetSupply.supply}</Col>
            </Row>,
            <hr key="supply-hr" />
        ];
    }
}
