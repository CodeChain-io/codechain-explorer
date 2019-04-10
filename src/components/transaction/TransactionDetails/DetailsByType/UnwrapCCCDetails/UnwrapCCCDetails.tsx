import { TransactionDoc, UnwrapCCCTransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import { CommaNumberString } from "src/components/util/CommaNumberString/CommaNumberString";

interface Props {
    tx: TransactionDoc;
}

export default class UnwrapCCCDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as UnwrapCCCTransactionDoc;
        return [
            <Row key="receiver">
                <Col md="3">Receiver</Col>
                <Col md="9">{transaction.unwrapCCC.receiver}</Col>
            </Row>,
            <hr key="receiver-hr" />,
            <Row key="quantity">
                <Col md="3">Quantity</Col>
                <Col md="9">
                    <CommaNumberString text={transaction.unwrapCCC.burn.prevOut.quantity} />
                    <span className="ccc">CCC</span>
                </Col>
            </Row>,
            <hr key="quantity-hr" />
        ];
    }
}
