import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';
import * as FontAwesome from "react-fontawesome";

import { RequestTransaction } from "../../request";
import TransactionDetails from "../../components/transaction/TransactionDetails/TransactionDetails";

import "./Transaction.scss";
// import TransactionSummary from "../../components/transaction/TransactionSummary/TransactionSummary";
import { TransactionDoc } from "../../../db/DocType";
import RequestPendingTransaction from "../../request/RequestPendingTransaction";
import { PendingTransactionDoc } from "../../../db/DocType";

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
                <div className="title-container d-flex mb-2 align-items-center">
                    <h1 className="d-inline-block">Transaction Information</h1>
                    <div className={`mr-auto d-inline-block transaction-type ${transactionResult.transaction.type === "assetTransfer" ? "asset-transfer-type" : "asset-mint-type"}`}>
                        <span>{transactionResult.transaction.type}</span>
                    </div>
                    <div className={`d-inline-block`}>
                        {
                            this.getStatusElement(transactionResult.status)
                        }
                    </div>
                </div>
                {
                    /*
                        <div className="mb-3">
                            {<TransactionSummary transaction={transaction} />}
                        </div>
                    */
                }
                <TransactionDetails transaction={transactionResult.transaction} />
            </Container>
        )
    }

    private getStatusElement = (status: string) => {
        switch (status) {
            case "dead":
                return <div className="dead"><FontAwesome name="circle" />&nbsp;Dead</div>
            case "confirmed":
                return <div className="confirmed"><FontAwesome name="circle" />&nbsp;Confirmed</div>
            case "pending":
                return <div className="pending"><FontAwesome name="circle" />&nbsp;Pending</div >
        }
        return null;
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
