import { PayTransactionDoc, TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import { Link } from "react-router-dom";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    tx: TransactionDoc;
}

export default class PayDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as PayTransactionDoc;
        return [
            <Row key="row1">
                <Col md="3">Quantity</Col>
                <Col md="9">
                    {transaction.pay.quantity}
                    CCC
                </Col>
            </Row>,
            <hr key="hr1" />,
            <Row key="row2">
                <Col md="3">Receiver</Col>
                <Col md="9">
                    <Link to={`/addr-platform/${transaction.pay.receiver}`}>{transaction.pay.receiver}</Link>
                </Col>
            </Row>,
            <hr key="hr2" />
        ];
    }
}
