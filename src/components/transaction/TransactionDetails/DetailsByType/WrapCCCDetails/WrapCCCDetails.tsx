import { TransactionDoc, WrapCCCTransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import { changeQuarkStringToCCC } from "../../../../../utils/Formatter";

interface Props {
    tx: TransactionDoc;
}

export default class WrapCCCDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as WrapCCCTransactionDoc;
        return [
            <Row key="quantity">
                <Col md="3">Quantity</Col>
                <Col md="9">
                    {changeQuarkStringToCCC(transaction.wrapCCC.quantity)}
                    CCC
                </Col>
            </Row>,
            <hr key="quantity-hr" />
        ];
    }
}
