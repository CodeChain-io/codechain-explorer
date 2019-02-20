import { SetRegularKeyTransactionDoc, TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    tx: TransactionDoc;
}

export default class SetRegularKeyDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as SetRegularKeyTransactionDoc;
        return [
            <Row key="key">
                <Col md="3">Key</Col>
                <Col md="9">{transaction.setRegularKey.key}</Col>
            </Row>,
            <hr key="key-hr" />
        ];
    }
}
