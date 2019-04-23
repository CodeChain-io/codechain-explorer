import * as _ from "lodash";
import * as React from "react";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TransactionDoc } from "codechain-indexer-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ImageLoader } from "src/components/util/ImageLoader/ImageLoader";
import DataTable from "../../util/DataTable/DataTable";
import HexString from "../../util/HexString/HexString";
import { TypeBadge } from "../../util/TypeBadge/TypeBadge";
import "./LatestTransactions.scss";

interface OwnProps {
    transactions: TransactionDoc[];
}

type Props = OwnProps;

const LatestTransactions = (props: Props) => {
    const { transactions } = props;

    const renderTableBody = () => {
        if (transactions.length === 0) {
            return (
                <tr>
                    <td colSpan={3}>
                        <div className="text-center mt-3">
                            <FontAwesomeIcon className="spin" icon={faSpinner} spin={true} size={"2x"} />
                        </div>
                    </td>
                </tr>
            );
        }

        return _.map(transactions.slice(0, 10), (transaction: TransactionDoc) => (
            <tr key={`home-transaction-hash-${transaction.hash}`} className="animated fadeIn">
                <td>
                    <TypeBadge transaction={transaction} />{" "}
                </td>
                <td scope="row">
                    <HexString link={`/tx/0x${transaction.hash}`} text={transaction.hash} />
                </td>
                <td>
                    <Link to={`/addr-platform/${transaction.signer}`}>
                        <ImageLoader size={15} data={transaction.signer} isAssetImage={false} />
                        <span className="ml-1">{transaction.signer}</span>
                    </Link>
                </td>
            </tr>
        ));
    };

    return (
        <div className="latest-transactions">
            <h1>Latest Transactions</h1>
            <div className="latest-container">
                <DataTable>
                    <thead>
                        <tr>
                            <th style={{ width: "25%" }}>Type</th>
                            <th style={{ width: "25%" }}>Hash</th>
                            <th style={{ width: "50%" }}>Signer</th>
                        </tr>
                    </thead>
                    <tbody>{renderTableBody()}</tbody>
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

export default connect()(LatestTransactions);
