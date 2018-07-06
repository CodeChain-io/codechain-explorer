import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';
import { Link } from "react-router-dom";

import { Block, ChangeShardState, AssetMintTransaction, AssetTransferTransaction } from "codechain-sdk";

import './LatestTransactions.scss';

interface Props {
    blocksByNumber: {
        [n: number]: Block;
    }
}

const LatestTransactions = (props: Props) => {
    const { blocksByNumber } = props;
    return <div className="latest-transactions">
        <h3>Latest Transactions</h3>
        <div className="latest-container">
            <Table striped={true}>
                <thead>
                    <tr>
                        <th>Hash</th>
                        <th>Type</th>
                        <th>AssetType</th>
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
                                        return (
                                            <tr key={`home-transaction-hash-${transaction.hash().value}`}>
                                                <th scope="row"><Link to="#">0x{transaction.hash().value.slice(0, 30)}...</Link></th>
                                                <td>{transaction.toJSON().type}</td>
                                                <td>{transaction instanceof AssetMintTransaction ? "0x" + transaction.getAssetSchemeAddress().value.slice(0, 10) + '...' : (transaction instanceof AssetTransferTransaction ? _.reduce(transaction.toJSON().data.inputs, (memo, input) => ("0x" + input.prevOut.assetType.slice(0, 10) + "..." + " " + memo), "") : "")}</td>
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
        </div>
    </div>
};

export default LatestTransactions;
