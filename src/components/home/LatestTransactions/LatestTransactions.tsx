import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";

import { TransactionDoc } from "codechain-indexer-types";
import { Link } from "react-router-dom";
import DataTable from "../../util/DataTable/DataTable";
import HexString from "../../util/HexString/HexString";
import { TypeBadge } from "../../util/TypeBadge/TypeBadge";
import "./LatestTransactions.scss";

interface Props {
    transactions: TransactionDoc[];
}

const LatestTransactions = (props: Props) => {
    const { transactions } = props;
    return (
        <div className="latest-transactions">
            <h1>Latest Transactions</h1>
            <div className="latest-container">
                <DataTable>
                    <thead>
                        <tr>
                            <th style={{ width: "20%" }}>Type</th>
                            <th style={{ width: "25%" }}>Hash</th>
                            <th style={{ width: "15%" }} className="text-right">
                                Fee
                            </th>
                            <th style={{ width: "25%" }}>Signer</th>
                            <th style={{ width: "15%" }} className="text-right">
                                Last seen
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(transactions.slice(0, 10), (transaction: TransactionDoc) => {
                            return (
                                <tr key={`home-transaction-hash-${transaction.hash}`} className="animated fadeIn">
                                    <td>
                                        <TypeBadge transaction={transaction} />{" "}
                                    </td>
                                    <td scope="row">
                                        <HexString link={`/tx/0x${transaction.hash}`} text={transaction.hash} />
                                    </td>
                                    <td className="text-right">
                                        {transaction.fee}
                                        CCC
                                    </td>
                                    <td>
                                        <Link to={`/addr-platform/${transaction.signer}`}>{transaction.signer}</Link>
                                    </td>
                                    <td className="text-right">{moment.unix(transaction.timestamp!).fromNow()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </DataTable>
                {
                    <div className="mt-small">
                        <Link to={"/txs"}>
                            <button type="button" className="btn btn-primary w-100">
                                <span>View all transactions</span>
                            </button>
                        </Link>
                    </div>
                }
            </div>
        </div>
    );
};

export default LatestTransactions;
