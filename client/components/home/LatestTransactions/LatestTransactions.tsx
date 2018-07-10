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
        <h3>Latest Transactions</h3>
        <div className="latest-container">
            <Table striped={true}>
                <thead>
                    <tr>
                        <th>Hash</th>
                        <th>Parcel Hash</th>
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
                                                <th scope="row"><HexString link={`/tx/0x${transaction.hash().value}`} length={10} text={transaction.hash().value} /></th>
                                                <td><HexString link={`/parcel/${parcel.hash().value}`} text={parcel.hash().value} length={10} /></td>
                                                <td>{transaction.toJSON().type}</td>
                                                <td>{transaction instanceof AssetMintTransaction ? <HexString text={transaction.getAssetSchemeAddress().value} length={10} /> : (transaction instanceof AssetTransferTransaction ? <div>{_.map(transaction.toJSON().data.inputs, (input) => (<HexString text={input.prevOut.assetType} length={10} />))}</div> : "")}</td>
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
