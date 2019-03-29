import { TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import { Link } from "react-router-dom";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import { changeQuarkStringToCCC } from "../../../../utils/Formatter";
import { StatusBadge } from "../../../util/StatusBadge/StatusBadge";
import { TypeBadge } from "../../../util/TypeBadge/TypeBadge";

interface Props {
    tx: TransactionDoc;
}

export default class CommonDetails extends React.Component<Props, any> {
    public render() {
        const { tx: transaction } = this.props;
        return [
            <Row key="type">
                <Col md="3">Type</Col>
                <Col md="9">
                    <TypeBadge transaction={transaction} />
                </Col>
            </Row>,
            <hr key="type-hr" />,
            <Row key="block">
                <Col md="3">Block</Col>
                <Col md="9">
                    <Link to={`/block/${transaction.blockNumber}`}>{transaction.blockNumber}</Link>
                </Col>
            </Row>,
            <hr key="block-hr" />,
            !transaction.isPending && [
                <Row key="index-row">
                    <Col md="3">Transaction Index</Col>
                    <Col md="9">{transaction.transactionIndex!.toLocaleString()}</Col>
                </Row>,
                <hr key="index-hr" />
            ],
            <Row key="sequence">
                <Col md="3">Sequence</Col>
                <Col md="9">{transaction.seq}</Col>
            </Row>,
            <hr key="sequence-hr" />,
            <Row key="fee">
                <Col md="3">Fee</Col>
                <Col md="9">
                    {changeQuarkStringToCCC(transaction.fee)}
                    CCC
                </Col>
            </Row>,
            <hr key="fee-hr" />,
            <Row key="signer">
                <Col md="3">Signer</Col>
                <Col md="9">
                    <Link to={`/addr-platform/${transaction.signer}`}>{transaction.signer}</Link>
                </Col>
            </Row>,
            <hr key="signer-hr" />,
            <Row key="networkId">
                <Col md="3">NetworkID</Col>
                <Col md="9">{transaction.networkId}</Col>
            </Row>,
            <hr key="networkId-hr" />,
            <Row key="status">
                <Col md="3">Status</Col>
                <Col md="9">
                    <StatusBadge tx={transaction} />
                </Col>
            </Row>,
            <hr key="status-hr" />
        ];
    }
}
