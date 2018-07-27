import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from "reactstrap";

import "./LatestTransactions.scss";
import HexString from "../../util/HexString/HexString";
import { BlockDoc, Type, ChangeShardStateDoc, AssetMintTransactionDoc, AssetTransferTransactionDoc } from "../../../../db/DocType";
import { Link } from "react-router-dom";

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
                        _.flatMap(_.reverse(_.values(blocksByNumber)), block => {
                            return _.chain(block.parcels).filter(parcel => Type.isChangeShardStateDoc(parcel.action))
                                .flatMap(parcel => (parcel.action as ChangeShardStateDoc).transactions)
                                .map(transaction => {
                                    const transactionType = transaction.type;
                                    return (
                                        <tr key={`home-transaction-hash-${transaction.data.hash}`}>
                                            <td><div className={`transaction-type text-center ${transactionType === "assetMint" ? "asset-mint-type" : "asset-transfer-type"}`}>{transactionType}</div></td>
                                            <td scope="row"><HexString link={`/tx/0x${transaction.data.hash}`} text={transaction.data.hash} /></td>
                                            <td>{Type.isAssetMintTransactionDoc(transaction) ?
                                                <HexString link={`/asset/${(transaction as AssetMintTransactionDoc).data.output.assetType}`} text={(transaction as AssetMintTransactionDoc).data.output.assetType} />
                                                : (Type.isAssetTransferTransactionDoc(transaction) ? <HexString link={`/asset/0x${(transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetType}`} text={(transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetType} /> : "")}</td>
                                            <td>{Type.isAssetMintTransactionDoc(transaction) ? (transaction as AssetMintTransactionDoc).data.output.amount : (Type.isAssetTransferTransactionDoc(transaction) ? _.sumBy((transaction as AssetTransferTransactionDoc).data.inputs, (input) => input.prevOut.amount) : "")}</td>
                                            <td>{moment.unix(block.timestamp).fromNow()}</td>
                                        </tr>
                                    );
                                }).value();
                        }).slice(0, 10)
                    }
                </tbody>
            </Table>
            {
                <div className="mt-3">
                    <Link to="/txs">
                        <div className="view-all-btn text-center mx-auto">
                            <span>View All</span>
                        </div>
                    </Link>
                </div>
            }
        </div>
    </div>
};

export default LatestTransactions;
