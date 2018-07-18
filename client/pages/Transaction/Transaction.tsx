import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { RequestTransaction } from "../../request";
import TransactionDetails from "../../components/transaction/TransactionDetails/TransactionDetails";

import "./Transaction.scss";
// import TransactionSummary from "../../components/transaction/TransactionSummary/TransactionSummary";
import { TransactionDoc } from "../../db/DocType";

interface Props {
    match: match<{ hash: string }>;
}

interface State {
    transaction?: TransactionDoc;
}

class Transaction extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { hash } } } = this.props;
        const { match: { params: { hash: nextHash } } } = props;
        if (nextHash !== hash) {
            this.setState({ transaction: undefined });
        }
    }

    public render() {
        const { match: { params: { hash } } } = this.props;
        const { transaction } = this.state;
        if (!transaction) {
            return <RequestTransaction hash={hash}
                onTransaction={this.onTransaction}
                onTransactionNotExist={this.onTransactionNotExist}
                onError={this.onError} />
        }
        return (
            <Container className="transaction">
                <div className="title-container mb-2">
                    <h1 className="d-inline-block">Transaction Information</h1>
                    <div className={`d-inline-block transaction-type ${transaction.type === "assetTransfer" ? "asset-transfer-type" : "asset-mint-type"}`}>
                        <span>{transaction.type}</span>
                    </div>
                </div>
                {
                    /*
                        <div className="mb-3">
                            {<TransactionSummary transaction={transaction} />}
                        </div>
                    */
                }
                <TransactionDetails transaction={transaction} />
            </Container>
        )
    }

    private onTransaction = (transaction: TransactionDoc) => {
        this.setState({ transaction });
    }

    private onTransactionNotExist = () => {
        console.log("transaction not exist");
    }

    private onError = () => ({/* Not implemented */ });
}

export default Transaction;
