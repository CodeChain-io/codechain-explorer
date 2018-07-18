import * as React from "react";
import * as _ from "lodash";
import "./TransactionList.scss"
import HexString from "../../util/HexString/HexString";
import { TransactionDoc, Type, AssetMintTransactionDoc, AssetTransferTransactionDoc } from "../../../db/DocType";

interface Props {
    transactions: TransactionDoc[];
    searchByAssetType: boolean;
}
const TransactionObject = (transaction: TransactionDoc, searchByAssetType: boolean) => {
    if (Type.isAssetMintTransactionDoc(transaction)) {
        const transactionDoc = (transaction as AssetMintTransactionDoc);
        return [
            <tr key="asset-mint-transaction-asset-type">
                <td>AssetType</td>
                <td>{searchByAssetType ? transactionDoc.data.assetType : <HexString link={`/asset/0x${transactionDoc.data.assetType}`} text={transactionDoc.data.assetType} />}</td>
            </tr>,
            <tr key="asset-mint-transaction-amount">
                <td>Amount</td>
                <td>{transactionDoc.data.amount}</td>
            </tr>
        ]
    } else if (Type.isAssetTransferTransactionDoc(transaction)) {
        const transactionDoc = (transaction as AssetTransferTransactionDoc);
        return [
            <tr key="asset-transfer-transaction-type">
                <td>AssetType</td>
                <td>{
                    _.map(transactionDoc.data.inputs, (input, index) => {
                        return <div key={`asset-transfer-transaction-${index}`}>{searchByAssetType ? input.prevOut.assetType : <HexString link={`/asset/0x${input.prevOut.assetType}`} text={input.prevOut.assetType} />}</div>
                    })
                }</td>
            </tr>,
            <tr key="asset-transfer-transaction-amount">
                <td>Amount</td>
                <td>{_.sumBy(transactionDoc.data.inputs, (input) => (input.prevOut.amount))}</td>
            </tr>
        ]
    }
    return null;
}

const TransactionList = (props: Props) => {
    const { transactions, searchByAssetType } = props;
    return <div className="mb-3">{transactions.map((transaction, i: number) => {
        const hash = transaction.data.hash;
        return <div key={`parcel-transaction-${hash}`} className="parcel-transaction-list-container mt-3">
            <b>Transaction</b>
            <table>
                <tbody>
                    <tr>
                        <td>Hash</td>
                        <td><HexString link={`/tx/0x${hash}`} text={hash} /></td>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>{transaction.type}</td>
                    </tr>
                    {TransactionObject(transaction, searchByAssetType)}
                </tbody>
            </table>
        </div>
    })}</div>
};

export default TransactionList;
