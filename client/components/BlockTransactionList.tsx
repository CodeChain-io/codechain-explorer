import * as React from "react";

interface Props {
    transactions: any[];
}

const BlockTransactionList = (props: Props) => {
    const { transactions } = props;
    return <div>{transactions.map(tx => (
        <div>
            <div>Hash {tx.hash}</div>
            <div>Nonce {tx.nonce}</div>
            <div>Fee {tx.fee}</div>
            <div>NetworkId {tx.networkId}</div>
        </div>
    ))}</div>
};

export default BlockTransactionList;
