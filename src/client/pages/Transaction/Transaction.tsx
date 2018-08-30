import * as moment from "moment";
import * as React from "react";
import { match } from "react-router";
import { Col, Container, Row } from "reactstrap";
import { Error } from "../../components/error/Error/Error";

import TransactionDetails from "../../components/transaction/TransactionDetails/TransactionDetails";
import { RequestTransaction } from "../../request";

import { TransactionDoc } from "../../../db/DocType";
import { PendingTransactionDoc } from "../../../db/DocType";
import TransactionSummary from "../../components/transaction/TransactionSummary/TransactionSummary";
import CopyButton from "../../components/util/CopyButton/CopyButton";
import HexString from "../../components/util/HexString/HexString";
import RequestPendingTransaction from "../../request/RequestPendingTransaction";
import "./Transaction.scss";

interface Props {
    match: match<{ hash: string }>;
}

interface TransactionResult {
    transaction: TransactionDoc;
    status: string;
}

interface State {
    transactionResult?: TransactionResult;
    notExistedInBlock: boolean;
    notExistedInPendingParcel: boolean;
}

class Transaction extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            notExistedInBlock: false,
            notExistedInPendingParcel: false
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
                transactionResult: undefined,
                notExistedInBlock: false,
                notExistedInPendingParcel: false
            });
        }
    }

    public render() {
        const {
            match: {
                params: { hash }
            }
        } = this.props;
        const {
            transactionResult,
            notExistedInBlock,
            notExistedInPendingParcel
        } = this.state;
        if (!transactionResult) {
            if (!notExistedInBlock) {
                return (
                    <RequestTransaction
                        hash={hash}
                        onTransaction={this.onTransaction}
                        onTransactionNotExist={this.onTransactionNotExist}
                        onError={this.onError}
                    />
                );
            } else if (!notExistedInPendingParcel) {
                return (
                    <RequestPendingTransaction
                        hash={hash}
                        onError={this.onError}
                        onPendingTransaction={this.onPendingTransaction}
                        onPendingTransactionNotExist={
                            this.onPendingTransactionNotExist
                        }
                    />
                );
            } else {
                return (
                    <div>
                        <Error
                            content={hash}
                            title="The transaction does not exist."
                        />
                    </div>
                );
            }
        }
        return (
            <Container className="transaction">
                <Row>
                    <Col md="8" xl="7">
                        <div className="d-flex title-container">
                            <h1 className="d-inline-block align-self-center mr-auto">
                                Transaction
                            </h1>
                            {transactionResult.status === "confirmed" ? (
                                <span className="timestamp align-self-end">
                                    {moment
                                        .unix(
                                            transactionResult.transaction.data
                                                .timestamp
                                        )
                                        .format("YYYY-MM-DD HH:mm:ssZ")}
                                </span>
                            ) : null}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md="8" xl="7" className="hash-container d-flex">
                        <div className="d-inline-block hash">
                            <HexString
                                text={transactionResult.transaction.data.hash}
                            />
                        </div>
                        <CopyButton
                            className="d-inline-block"
                            copyString={`0x${
                                transactionResult.transaction.data.hash
                            }`}
                        />
                    </Col>
                </Row>
                <div className="mt-large">
                    <TransactionSummary
                        transaction={transactionResult.transaction}
                    />
                </div>
                <div className="mt-large">
                    <TransactionDetails
                        transaction={transactionResult.transaction}
                        status={transactionResult.status}
                    />
                </div>
            </Container>
        );
    }

    private onPendingTransactionNotExist = () => {
        this.setState({ notExistedInPendingParcel: true });
    };

    private onPendingTransaction = (
        pendingTransaction: PendingTransactionDoc
    ) => {
        const transactionResult = {
            transaction: pendingTransaction.transaction,
            status: pendingTransaction.status
        };
        this.setState({ transactionResult });
    };

    private onTransaction = (transaction: TransactionDoc) => {
        const transactionResult = {
            transaction,
            status: "confirmed"
        };
        this.setState({ transactionResult });
    };

    private onTransactionNotExist = () => {
        this.setState({ notExistedInBlock: true });
    };

    private onError = (e: any) => {
        console.log(e);
    };
}

export default Transaction;
