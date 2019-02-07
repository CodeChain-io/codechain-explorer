import * as moment from "moment";
import * as React from "react";
import { match } from "react-router";
import { Col, Container, Row } from "reactstrap";
import { Error } from "../../components/error/Error/Error";

import TransactionDetails from "../../components/transaction/TransactionDetails/TransactionDetails";
import { RequestTransaction } from "../../request";

import { TransactionDoc } from "codechain-indexer-types";
import TransactionSummary from "../../components/transaction/TransactionSummary/TransactionSummary";
import CopyButton from "../../components/util/CopyButton/CopyButton";
import HexString from "../../components/util/HexString/HexString";
import "./Transaction.scss";

interface Props {
    match: match<{ hash: string }>;
}

interface State {
    transaction?: TransactionDoc;
    notExisted: boolean;
    refresh: boolean;
}

class Transaction extends React.Component<Props, State> {
    private interval: NodeJS.Timer;
    constructor(props: Props) {
        super(props);
        this.state = {
            notExisted: false,
            refresh: false,
            transaction: undefined
        };
    }

    public componentWillReceiveProps(props: Props) {
        const {
            match: {
                params: { hash }
            }
        } = this.props;
        const {
            match: {
                params: { hash: nextHash }
            }
        } = props;
        if (nextHash !== hash) {
            this.setState({
                transaction: undefined,
                notExisted: false
            });
        }
    }

    public componentDidMount() {
        this.interval = setInterval(() => {
            if (this.state.transaction && this.state.transaction.isPending) {
                this.setState({
                    refresh: true
                });
            }
        }, 5000);
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    public render() {
        const {
            match: {
                params: { hash }
            }
        } = this.props;
        const { transaction, notExisted, refresh } = this.state;
        if (!transaction) {
            if (!notExisted) {
                return (
                    <RequestTransaction
                        hash={hash}
                        onTransaction={this.onTransaction}
                        onTransactionNotExist={this.onTransactionNotExist}
                        onError={this.onError}
                    />
                );
            } else {
                return (
                    <div>
                        <Error content={hash} title="The transaction does not exist." />
                    </div>
                );
            }
        }
        return (
            <Container className="transaction animated fadeIn">
                {transaction && transaction.isPending && refresh ? (
                    <RequestTransaction
                        hash={hash}
                        onTransaction={this.onTransaction}
                        onTransactionNotExist={this.onTransactionNotExist}
                        onError={this.onError}
                    />
                ) : null}
                <Row>
                    <Col md="8" xl="7">
                        <div className="d-flex title-container">
                            <h1 className="d-inline-block align-self-center mr-auto">Transaction</h1>
                            {!transaction.isPending ? (
                                <span className="timestamp align-self-end">
                                    {moment.unix(transaction.timestamp!).format("YYYY-MM-DD HH:mm:ssZ")}
                                </span>
                            ) : null}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="8" xl="7" className="hash-container d-flex">
                        <div className="d-inline-block hash">
                            <HexString text={transaction.hash} />
                        </div>
                        <CopyButton className="d-inline-block" copyString={`0x${transaction.hash}`} />
                    </Col>
                </Row>
                <div className="mt-large">
                    <TransactionSummary transaction={transaction} />
                </div>
                <div className="mt-large">
                    <TransactionDetails transaction={transaction} />
                </div>
            </Container>
        );
    }

    private onTransaction = (transaction: TransactionDoc) => {
        this.setState({ transaction });
    };

    private onTransactionNotExist = () => {
        this.setState({ notExisted: true });
    };

    private onError = (e: any) => {
        console.log(e);
    };
}

export default Transaction;
