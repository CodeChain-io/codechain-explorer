import * as React from "react";
import * as _ from "lodash";

import { Transaction, AssetMintTransaction, AssetTransferTransaction } from "codechain-sdk/lib/core/classes";

import "./ParcelTransactionList.scss"
import HexString from "../../util/HexString/HexString";

interface Props {
    transactions: Transaction[];
}
const TransactionObject = (transaction: Transaction) => {
    if (transaction instanceof AssetMintTransaction) {
        return [
            <tr key="asset-mint-transaction-asset-type">
                <td>AssetType</td>
                <td><HexString link={`/asset/0x${transaction.getAssetSchemeAddress().value}`} text={transaction.getAssetSchemeAddress().value} /></td>
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
                <td>{
                    _.map(transaction.toJSON().data.inputs, (input, index) => {
                        return <div key={`asset-transfer-transaction-${index}`}><HexString link={`/asset/0x${input.prevOut.assetType}`} text={input.prevOut.assetType} /></div>
                    })
                }</td>
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
                        <td><HexString link={`/tx/0x${hash}`} text={hash} /></td>
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
