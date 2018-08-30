import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { Table } from "reactstrap";

import { Link } from "react-router-dom";
import {
    AssetMintTransactionDoc,
    AssetTransferTransactionDoc,
    TransactionDoc,
    Type
} from "../../../../db/DocType";
import HexString from "../../util/HexString/HexString";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";
import { TypeBadge } from "../../util/TypeBadge/TypeBadge";
import "./LatestTransactions.scss";

interface Props {
    transactions: TransactionDoc[];
}

function getTotalAssetCount(transaction: TransactionDoc) {
    let totalInputCount = 0;
    if (Type.isAssetMintTransactionDoc(transaction)) {
        totalInputCount =
            (transaction as AssetMintTransactionDoc).data.output.amount || 0;
    } else if (Type.isAssetTransferTransactionDoc(transaction)) {
        totalInputCount = _.sumBy(
            (transaction as AssetTransferTransactionDoc).data.inputs,
            input => input.prevOut.amount
        );
    }
    const totalBurnCount = Type.isAssetTransferTransactionDoc(transaction)
        ? _.sumBy(
              (transaction as AssetTransferTransactionDoc).data.burns,
              burn => burn.prevOut.amount
          )
        : 0;
    return totalInputCount + totalBurnCount;
}

function getAssetInfo(transaction: TransactionDoc) {
    let assetType = "";
    let assetIamge;
    if (Type.isAssetMintTransactionDoc(transaction)) {
        assetType = (transaction as AssetMintTransactionDoc).data.output
            .assetType;
        assetIamge = Type.getMetadata(
            (transaction as AssetMintTransactionDoc).data.metadata
        ).icon_url;
    } else {
        if (
            (transaction as AssetTransferTransactionDoc).data.inputs.length > 0
        ) {
            assetType = (transaction as AssetTransferTransactionDoc).data
                .inputs[0].prevOut.assetType;
            assetIamge = Type.getMetadata(
                (transaction as AssetTransferTransactionDoc).data.inputs[0]
                    .prevOut.assetScheme.metadata
            ).icon_url;
        } else if (
            (transaction as AssetTransferTransactionDoc).data.burns.length > 0
        ) {
            assetType = (transaction as AssetTransferTransactionDoc).data
                .burns[0].prevOut.assetType;
            assetIamge = Type.getMetadata(
                (transaction as AssetTransferTransactionDoc).data.burns[0]
                    .prevOut.assetScheme.metadata
            ).icon_url;
        }
    }
    return (
        <span>
            <ImageLoader
                className="mr-2"
                data={assetType}
                url={assetIamge}
                size={18}
            />
            <HexString link={`/asset/0x${assetType}`} text={assetType} />
        </span>
    );
}

const LatestTransactions = (props: Props) => {
    const { transactions } = props;
    return (
        <div className="latest-transactions">
            <h1>Latest Transactions</h1>
            <div className="latest-container">
                <Table striped={true} className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: "20%" }}>Type</th>
                            <th style={{ width: "20%" }}>Hash</th>
                            <th style={{ width: "25%" }}>Assets</th>
                            <th style={{ width: "15%" }}>Amount</th>
                            <th style={{ width: "20%" }}>Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(transactions.slice(0, 10), transaction => {
                            return (
                                <tr
                                    key={`home-transaction-hash-${
                                        transaction.data.hash
                                    }`}
                                >
                                    <td>
                                        <TypeBadge transaction={transaction} />{" "}
                                    </td>
                                    <td scope="row">
                                        <HexString
                                            link={`/tx/0x${
                                                transaction.data.hash
                                            }`}
                                            text={transaction.data.hash}
                                        />
                                    </td>
                                    <td>{getAssetInfo(transaction)}</td>
                                    <td>
                                        {getTotalAssetCount(
                                            transaction
                                        ).toLocaleString()}
                                    </td>
                                    <td>
                                        {moment
                                            .unix(transaction.data.timestamp)
                                            .fromNow()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                {
                    <div className="mt-small">
                        <Link to={"/txs"}>
                            <button
                                type="button"
                                className="btn btn-primary w-100"
                            >
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
