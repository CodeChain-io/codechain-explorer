import { StoreTransactionDoc, TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import { Link } from "react-router-dom";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    tx: TransactionDoc;
}

export default class StoreDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as StoreTransactionDoc;
        return [
            <Row key="content">
                <Col md="3">Content</Col>
                <Col md="9">
                    <div className="text-area">{transaction.store.content}</div>
                </Col>
            </Row>,
            <hr key="content-hr" />,
            <Row key="certifier">
                <Col md="3">Certifier</Col>
                <Col md="9">
                    <Link to={`/addr-asset/${transaction.store.certifier}`}>{transaction.store.certifier}</Link>
                </Col>
            </Row>,
            <hr key="certifier-hr" />
        ];
    }
}
