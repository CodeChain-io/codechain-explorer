import { RemoveTransactionDoc, TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    tx: TransactionDoc;
}

export default class RemoveDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as RemoveTransactionDoc;
        return [
            <Row key="signature">
                <Col md="3">Signature</Col>
                <Col md="9">
                    <div className="text-area">{transaction.remove.signature}</div>
                </Col>
            </Row>,
            <hr key="signature-hr" />,
            <Row key="textHash">
                <Col md="3">Text hash</Col>
                <Col md="9">{transaction.remove.textHash}</Col>
            </Row>,
            <hr key="textHash-hr" />
        ];
    }
}
