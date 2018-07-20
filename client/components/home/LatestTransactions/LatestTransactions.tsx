import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';

import './LatestTransactions.scss';
import HexString from "../../util/HexString/HexString";
import { BlockDoc, Type, ChangeShardStateDoc, AssetMintTransactionDoc, AssetTransferTransactionDoc } from "../../../db/DocType";

interface Props {
    blocksByNumber: {
        [n: number]: BlockDoc;
    }
}

const LatestTransactions = (props: Props) => {
    const { blocksByNumber } = props;
    return <div className="latest-transactions">
        <h1>Latest Transactions</h1>
        <div className="latest-container">
            <Table striped={true}>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Hash</th>
                        <th>Assets</th>
                        <th>Amount</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        _.map(_.reverse(_.values(blocksByNumber)), block => {
                            return _.map(block.parcels, (parcel) => {
                                if (Type.isChangeShardStateDoc(parcel.action)) {
                                    const transactions = (parcel.action as ChangeShardStateDoc).transactions;
                                    return _.map(transactions, (transaction) => {
                                        const transactionType = transaction.type;
                                        return (
                                            <tr key={`home-transaction-hash-${transaction.data.hash}`}>
                                                <td><div className={`transaction-type text-center ${transactionType === "assetMint" ? "asset-mint-type" : "asset-transfer-type"}`}>{transactionType}</div></td>
                                                <td scope="row"><HexString link={`/tx/0x${transaction.data.hash}`} length={10} text={transaction.data.hash} /></td>
                                                <td>{Type.isAssetMintTransactionDoc(transaction) ?
                                                    <HexString link={`/asset/${(transaction as AssetMintTransactionDoc).data.output.assetType}`} text={(transaction as AssetMintTransactionDoc).data.output.assetType} length={10} />
                                                    : (Type.isAssetTransferTransactionDoc(transaction) ? <div>{_.map((transaction as AssetTransferTransactionDoc).data.inputs, (input, index) => (<div key={`latest-transaction-assetType-${index}`}><HexString link={`/asset/0x${input.prevOut.assetType}`} text={input.prevOut.assetType} length={10} /></div>))}</div> : "")}</td>
                                                <td>{Type.isAssetMintTransactionDoc(transaction) ? (transaction as AssetMintTransactionDoc).data.output.amount : (Type.isAssetTransferTransactionDoc(transaction) ? _.sumBy((transaction as AssetTransferTransactionDoc).data.inputs, (input) => input.prevOut.amount) : "")}</td>
                                                <td>{moment.unix(block.timestamp).fromNow()}</td>
                                            </tr>
                                        );
                                    });
                                }
                                return null;
                            })
                        })
                    }
                </tbody>
            </Table>
            {
                /*
                    <div className="mt-3">
                        <div className="view-all-btn text-center mx-auto">
                            <span>View All</span>
                        </div>
                    </div>
                */
            }
        </div>
    </div>
};

export default LatestTransactions;
