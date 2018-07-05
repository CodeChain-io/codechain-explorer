import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';
import { Link } from "react-router-dom";

import { Block } from "codechain-sdk";

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
            <Table>
                <thead>
                    <th>Hash</th>
                    <th>Type</th>
                    <th>Summary</th>
                    <th>Age</th>
                </thead>
                <tbody>
                    {
                        _.map(_.reverse(_.values(blocksByNumber)), block => {
                            return _.map(block.parcels, (parcel) => {
                                return (
                                    <tr key={`home-transaction-hash-${block.hash.value}`}>
                                        <th scope="row"><Link to={`/block/${block.number}`}>{block.number}</Link></th>
                                        <td>{block.parcels.length}</td>
                                        <td>{}</td>
                                        <td>{moment.unix(block.timestamp).fromNow()}</td>
                                    </tr>
                                );
                            })
                        })
                    }
                </tbody>
            </Table>
        </div>
    </div>
};

export default LatestTransactions;
