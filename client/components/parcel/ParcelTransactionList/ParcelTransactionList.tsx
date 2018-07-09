import * as React from "react";
import * as _ from "lodash";
import { Link } from "react-router-dom";

import { Transaction, AssetMintTransaction, AssetTransferTransaction } from "codechain-sdk";

import "./ParcelTransactionList.scss"

interface Props {
    transactions: Transaction[];
}
const TransactionObject = (transaction: Transaction) => {
    if (transaction instanceof AssetMintTransaction) {
        return [
            <tr key="asset-mint-transaction-asset-type">
                <td>AssetType</td>
                <td>{transaction.getAssetSchemeAddress().value}</td>
            </tr>,
            <tr key="asset-mint-transaction-amount">
                <td>Amount</td>
                <td>{transaction.toJSON().data.amount}</td>
            </tr>
        ]
    } else if (transaction instanceof AssetTransferTransaction) {
        return [
            <tr key="asset-transfer-transaction-type">
                <td>AssetType</td>
                {
                    _.map(transaction.toJSON().data.inputs, (input, index) => {
                        return <td key={`asset-transfer-transaction-${index}`}>{input.prevOut.assetType}</td>
                    })
                }
            </tr>,
            <tr key="asset-transfer-transaction-amount">
                <td>Amount</td>
                <td>{_.sumBy(transaction.toJSON().data.inputs, (input) => (input.prevOut.amount))}</td>
            </tr>
        ]
    }
    return null;
}

const ParcelTransactionList = (props: Props) => {
    const { transactions } = props;
    return <div className="mb-3">{transactions.map((transaction, i: number) => {
        const hash = transaction.hash().value;
        return <div key={`parcel-transaction-${hash}`} className="parcel-transaction-list-container mt-3">
            <b>Transaction {i}</b>
            <table>
                <tbody>
                    <tr>
                        <td>Hash</td>
                        <td><Link to={`/tx/${hash}`}>0x{hash}</Link></td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>{transaction.toJSON().type}</td>
                    </tr>
                    {TransactionObject(transaction)}
                </tbody>
            </table>
        </div>
    })}</div>
};

export default ParcelTransactionList;
