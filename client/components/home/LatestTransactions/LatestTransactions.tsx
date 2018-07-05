import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';
import { Link } from "react-router-dom";

import { Block, ChangeShardState, AssetMintTransaction } from "codechain-sdk";

import './LatestTransactions.css';

interface Props {
    blocksByNumber: {
        [n: number]: Block;
    }
}

const LatestTransactions = (props: Props) => {
    const { blocksByNumber } = props;
    return <div>
        <h3>Latest Transactions</h3>
        <div className="latest-container">
            <Table striped={true}>
                <thead>
                    <tr>
                        <th>Hash</th>
                        <th>Type</th>
                        <th>Summary</th>
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
                                                <th scope="row"><Link to="#">{transaction.hash().value}</Link></th>
                                                <td>{parcel.unsigned.action.toJSON().action}</td>
                                                {/* TODO : Show Details */}
                                                <td>{transaction instanceof AssetMintTransaction ? 'Asset mint' : 'Asset transfer'}</td>
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
