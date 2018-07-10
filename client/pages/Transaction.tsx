import * as React from "react";
import { match } from "react-router";
import { Container } from 'reactstrap';

import { Transaction as TransactionType } from "codechain-sdk/lib/core/classes";

import { RequestTransaction } from "../request";
import TransactionDetails from "../components/transaction/TransactionDetails/TransactionDetails";

interface Props {
    match: match<{ hash: string }>;
}

interface State {
    transaction?: TransactionType;
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
        return (
            <div>
                <Container>
                    {transaction
                        ? <TransactionDetails transaction={transaction} />
                        : <div>loading transaction ...
                        <RequestTransaction hash={hash}
                                onTransaction={this.onTransaction}
                                onTransactionNotExist={this.onTransactionNotExist}
                                onError={this.onError} />
                        </div>}
                    {/* Show Parcel Invoices here */}
                </Container>
            </div>
        )
    }

    private onTransaction = (transaction: TransactionType) => {
        this.setState({ transaction });
    }

    private onTransactionNotExist = () => {
        console.log("transaction not exist");
    }

    private onError = () => ({/* Not implemented */ });
}

export default Transaction;
