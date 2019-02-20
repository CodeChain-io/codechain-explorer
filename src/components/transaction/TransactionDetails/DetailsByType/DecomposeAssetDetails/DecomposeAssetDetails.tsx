import { DecomposeAssetTransactionDoc, TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    tx: TransactionDoc;
}

export default class DecomposeAssetDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as DecomposeAssetTransactionDoc;
        return [
            <Row key="input">
                <Col md="3"># of Input</Col>
                <Col md="9">1</Col>
            </Row>,
            <hr key="input-hr" />,
            <Row key="output">
                <Col md="3"># of Output</Col>
                <Col md="9">{transaction.decomposeAsset.outputs.length.toLocaleString()}</Col>
            </Row>,
            <hr key="output-hr" />
        ];
    }
}
