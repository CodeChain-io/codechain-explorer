import * as React from "react";
import { Link } from "react-router-dom";

interface Props {
    transactions: any[];
}

const BlockTransactionList = (props: Props) => {
    const { transactions } = props;
    return <div>{transactions.map((tx: any, i: number) => (
        <div key={`block-tx-${tx.hash}`}>
            <hr />
            <b>Transaction {i} - </b>
            <span><Link to={`/tx/${tx.hash}`}>{tx.hash}</Link></span>
            <span> Action: {Object.keys(tx.action)}</span>
        </div>
    ))}</div>
};

export default BlockTransactionList;
