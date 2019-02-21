import { IncreaseAssetSupplyDoc } from "codechain-indexer-types";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    tx: IncreaseAssetSupplyDoc;
}

export default class IncreaseAssetSupplyDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        return [
            <Row key="supply">
                <Col md="3">Supply</Col>
                <Col md="9">{tx.increaseAssetSupply.supply}</Col>
            </Row>,
            <hr key="supply-hr" />
        ];
    }
}
