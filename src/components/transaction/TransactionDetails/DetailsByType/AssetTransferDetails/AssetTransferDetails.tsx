import { TransactionDoc, TransferAssetTransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    tx: TransactionDoc;
}

export default class AssetTransferDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as TransferAssetTransactionDoc;
        return [
            <Row key="input">
                <Col md="3"># of Input</Col>
                <Col md="9">{transaction.transferAsset.inputs.length.toLocaleString()}</Col>
            </Row>,
            <hr key="input-hr" />,
            <Row key="output">
                <Col md="3"># of Output</Col>
                <Col md="9">{transaction.transferAsset.outputs.length.toLocaleString()}</Col>
            </Row>,
            <hr key="output-hr" />,
            <Row key="burn">
                <Col md="3"># of Burn</Col>
                <Col md="9">{transaction.transferAsset.burns.length.toLocaleString()}</Col>
            </Row>,
            <hr key="burn-hr" />
        ];
    }
}
