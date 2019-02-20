import { CustomTransactionDoc, TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    tx: TransactionDoc;
}

export default class CustomDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as CustomTransactionDoc;
        return [
            <Row key="content">
                <Col md="3">Content</Col>
                <Col md="9">
                    <div className="text-area">{transaction.custom.content}</div>
                </Col>
            </Row>,
            <hr key="content-hr" />,
            <Row key="handlerId">
                <Col md="3">Handler id</Col>
                <Col md="9">{transaction.custom.handlerId}</Col>
            </Row>,
            <hr key="handlerId-hr" />
        ];
    }
}
