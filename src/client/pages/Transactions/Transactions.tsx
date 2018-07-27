import * as React from "react";
import { Container } from "reactstrap";

import { RequestTransactions } from "../../request";
import "./Transactions.scss";
import { TransactionDoc } from "../../../db/DocType";
import TransactionTable from "../../components/transactions/TransactionTable/TransactionTable";

interface State {
    transactions: TransactionDoc[];
    requested: boolean;
}

class Transactions extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            transactions: [],
            requested: false
        };
    }

    public render() {
        const { transactions, requested } = this.state;

        if (!requested) {
            return <RequestTransactions onTransactions={this.onTransactions} onError={this.onError} />;
        }
        return (
            <Container className="transactions">
                <h1>Latest transactions</h1>
                <TransactionTable transactions={transactions} />
            </Container>
        );
    }

    private onTransactions = (transactions: TransactionDoc[]) => {
        this.setState({ transactions });
        this.setState({ requested: true });
    };

    private onError = () => ({});
}

export default Transactions;
