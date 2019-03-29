import { TransactionDoc, UnwrapCCCTransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    tx: TransactionDoc;
}

export default class UnwrapCCCDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as UnwrapCCCTransactionDoc;
        return [
            <Row key="quantity">
                <Col md="3">Quantity</Col>
                <Col md="9">
                    {transaction.unwrapCCC.burn.prevOut.quantity}
                    CCC
                </Col>
            </Row>,
            <hr key="quantity-hr" />
        ];
    }
}
