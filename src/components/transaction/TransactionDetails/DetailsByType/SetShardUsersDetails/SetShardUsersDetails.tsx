import { SetShardUsersTransactionDoc, TransactionDoc } from "codechain-indexer-types";
import * as _ from "lodash";
import * as React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";

interface Props {
    tx: TransactionDoc;
}

export default class SetShardUsersDetails extends React.Component<Props, any> {
    public render() {
        const { tx } = this.props;
        const transaction = tx as SetShardUsersTransactionDoc;
        return [
            <Row key="shardId">
                <Col md="3">ShardId</Col>
                <Col md="9">{transaction.setShardUsers.shardId}</Col>
            </Row>,
            <hr key="shardId-hr" />,
            <Row key="users">
                <Col md="3">Users</Col>
                <Col md="9">
                    {transaction.setShardUsers.users.length !== 0 ? (
                        <div className="text-area">
                            {_.map(transaction.setShardUsers.users, (user, i) => {
                                return <div key={`transaction-heder-param-${i}`}>{user}</div>;
                            })}
                        </div>
                    ) : (
                        "None"
                    )}
                </Col>
            </Row>,
            <hr key="users-hr" />
        ];
    }
}
