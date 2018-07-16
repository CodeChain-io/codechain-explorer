import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';

import { Block, ChangeShardState, AssetMintTransaction, AssetTransferTransaction } from "codechain-sdk/lib/core/classes";

import './LatestTransactions.scss';
import HexString from "../../util/HexString/HexString";

interface Props {
    blocksByNumber: {
        [n: number]: Block;
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
                                if (parcel.unsigned.action instanceof ChangeShardState) {
                                    const transactions = parcel.unsigned.action.transactions;
                                    return _.map(transactions, (transaction) => {
                                        const transactionType = transaction.toJSON().type;
                                        return (
                                            <tr key={`home-transaction-hash-${transaction.hash().value}`}>
                                                <td><div className={`transaction-type text-center ${transactionType === "assetMint" ? "asset-mint-type" : "asset-transfer-type"}`}>{transactionType}</div></td>
                                                <td scope="row"><HexString link={`/tx/0x${transaction.hash().value}`} length={10} text={transaction.hash().value} /></td>
                                                <td>{transaction instanceof AssetMintTransaction ? <HexString link={`/asset/${transaction.getAssetSchemeAddress().value}`} text={transaction.getAssetSchemeAddress().value} length={10} /> : (transaction instanceof AssetTransferTransaction ? <div>{_.map(transaction.toJSON().data.inputs, (input, index) => (<div key={`latest-transaction-assetType-${index}`}><HexString link={`/asset/0x${input.prevOut.assetType}`} text={input.prevOut.assetType} length={10} /></div>))}</div> : "")}</td>
                                                <td>{transaction instanceof AssetMintTransaction ? transaction.toJSON().data.amount : (transaction instanceof AssetTransferTransaction ? _.sumBy(transaction.toJSON().data.inputs, (input) => input.prevOut.amount) : "")}</td>
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
            <div className="mt-3">
                <div className="view-all-btn text-center mx-auto">
                    <span>View All</span>
                </div>
            </div>
        </div>
    </div>
};

export default LatestTransactions;
