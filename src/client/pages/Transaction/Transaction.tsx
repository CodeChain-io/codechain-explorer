import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import * as moment from "moment";
import { match } from "react-router";
import { Container, Row, Col } from "reactstrap";

import { RequestTransaction } from "../../request";
import TransactionDetails from "../../components/transaction/TransactionDetails/TransactionDetails";

import "./Transaction.scss";
// import TransactionSummary from "../../components/transaction/TransactionSummary/TransactionSummary";
import { TransactionDoc } from "../../../db/DocType";
import RequestPendingTransaction from "../../request/RequestPendingTransaction";
import { PendingTransactionDoc } from "../../../db/DocType";
import HexString from "../../components/util/HexString/HexString";
import { TypeBadge } from "../../components/util/TypeBadge/TypeBadge";

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
        const { match: { params: { hash } } } = this.props;
        const { match: { params: { hash: nextHash } } } = props;
        if (nextHash !== hash) {
            this.setState({ transactionResult: undefined, notExistedInBlock: false, notExistedInPendingParcel: false });
        }
    }

    public render() {
        const { match: { params: { hash } } } = this.props;
        const { transactionResult, notExistedInBlock, notExistedInPendingParcel } = this.state;
        if (!transactionResult) {
            if (!notExistedInBlock) {
                return <RequestTransaction hash={hash}
                    onTransaction={this.onTransaction}
                    onTransactionNotExist={this.onTransactionNotExist}
                    onError={this.onError} />
            } else if (!notExistedInPendingParcel) {
                return <RequestPendingTransaction hash={hash} onError={this.onError} onPendingTransaction={this.onPendingTransaction} onPendingTransactionNotExist={this.onPendingTransactionNotExist} />
            } else {
                return <div>{hash} not found.</div>
            }
        }
        return (
            <Container className="transaction">
                <Row className="mb-2">
                    <Col md="8" xl="7">
                        <div className="d-flex title-container">
                            <h1 className="d-inline-block align-self-center">Transaction</h1>
                            <TypeBadge className="align-self-center ml-3 mr-auto" transaction={transactionResult.transaction} />
                            <span className="timestamp align-self-end">{moment.unix(transactionResult.transaction.data.timestamp).format("YYYY-MM-DD HH:mm:ssZ")}</span>
                        </div>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col md="8" xl="7" className="hash-container d-flex mb-3 mb-md-0">
                        <div className="d-inline-block hash">
                            <HexString text={transactionResult.transaction.data.hash} />
                        </div>
                        <div className="d-inline-block copy text-center">
                            <FontAwesome name="copy" />
                        </div>
                    </Col>
                </Row>
                <TransactionDetails transaction={transactionResult.transaction} />
            </Container>
        )
    }

    private onPendingTransactionNotExist = () => {
        this.setState({ notExistedInPendingParcel: true });
    }

    private onPendingTransaction = (pendingTransaction: PendingTransactionDoc) => {
        const transactionResult = {
            transaction: pendingTransaction.transaction,
            status: pendingTransaction.status
        }
        this.setState({ transactionResult });
    }

    private onTransaction = (transaction: TransactionDoc) => {
        const transactionResult = {
            transaction,
            status: "confirmed"
        }
        this.setState({ transactionResult });
    }

    private onTransactionNotExist = () => {
        this.setState({ notExistedInBlock: true });
    }

    private onError = (e: any) => {
        console.log(e);
    };
}

export default Transaction;
