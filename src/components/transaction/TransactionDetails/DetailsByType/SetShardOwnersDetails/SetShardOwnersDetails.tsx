import { SetShardOwnersTransactionDoc, TransactionDoc } from "codechain-indexer-types";
import * as _ from "lodash";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    tx: TransactionDoc;
}

export default class SetShardOwnersDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as SetShardOwnersTransactionDoc;
        return [
            <Row key="shardId">
                <Col md="3">ShardId</Col>
                <Col md="9">{transaction.setShardOwners.shardId}</Col>
            </Row>,
            <hr key="shardId-hr" />,
            <Row key="owners">
                <Col md="3">Owners</Col>
                <Col md="9">
                    {transaction.setShardOwners.owners.length !== 0 ? (
                        <div className="text-area">
                            {_.map(transaction.setShardOwners.owners, (owner, i) => {
                                return <div key={`transaction-heder-param-${i}`}>{owner}</div>;
                            })}
                        </div>
                    ) : (
                        "None"
                    )}
                </Col>
            </Row>,
            <hr key="owners-hr" />
        ];
    }
}
