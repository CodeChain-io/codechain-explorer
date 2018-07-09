import * as React from "react";

import { Transaction } from "codechain-sdk";

import TransactionHeaderTable from "../TransactionHeaderTable/TransactionHeaderTable";

import "./TransactionDetails.scss"

interface Props {
    transaction: Transaction;
}

const TransactionDetails = (props: Props) => {
    const { transaction } = props;

    return <div className="transaction-detail-container">
        <h3 className="mt-3">Transaction</h3>
        <h4 className="type">{transaction.toJSON().type}</h4>
        <TransactionHeaderTable transaction={transaction} />
    </div>
};

export default TransactionDetails;
