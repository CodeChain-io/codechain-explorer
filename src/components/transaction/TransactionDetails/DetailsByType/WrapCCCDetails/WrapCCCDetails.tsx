import { TransactionDoc, WrapCCCTransactionDoc } from "codechain-indexer-types";
import * as _ from "lodash";
import * as React from "react";
import { Link } from "react-router-dom";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import { CommaNumberString } from "src/components/util/CommaNumberString/CommaNumberString";
import { getLockScriptName } from "src/utils/Transactions";

interface Props {
    tx: TransactionDoc;
}

export default class WrapCCCDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as WrapCCCTransactionDoc;
        return [
            <Row key="shardId">
                <Col md="3">ShardId</Col>
                <Col md="9">{transaction.wrapCCC.shardId}</Col>
            </Row>,
            <hr key="shardId-hr" />,
            <Row key="lockScriptHash">
                <Col md="3">LockScriptHash</Col>
                <Col md="9">{getLockScriptName(transaction.wrapCCC.lockScriptHash)}</Col>
            </Row>,
            <hr key="lockScriptHash-hr" />,
            <Row key="parameters">
                <Col md="3">Parameters</Col>
                <Col md="9">
                    <div className="text-area">
                        {_.map(transaction.wrapCCC.parameters, (parameter, i) => {
                            return <div key={`transaction-heder-param-${i}`}>{parameter}</div>;
                        })}
                    </div>
                </Col>
            </Row>,
            <hr key="parameters-hr" />,
            <Row key="recipient">
                <Col md="3">Recipient</Col>
                <Col md="9">
                    {transaction.wrapCCC.recipient ? (
                        <Link to={`/addr-asset/${transaction.wrapCCC.recipient}`}>{transaction.wrapCCC.recipient}</Link>
                    ) : (
                        "Unknown"
                    )}
                </Col>
            </Row>,
            <hr key="recipient-hr" />,
            <Row key="quantity">
                <Col md="3">Quantity</Col>
                <Col md="9">
                    <CommaNumberString text={transaction.wrapCCC.quantity} />
                    <span className="ccc">CCC</span>
                </Col>
            </Row>,
            <hr key="quantity-hr" />
        ];
    }
}
