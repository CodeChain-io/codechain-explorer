import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from "reactstrap";

import "./LatestTransactions.scss";
import HexString from "../../util/HexString/HexString";
import { BlockDoc, Type, ChangeShardStateDoc, AssetMintTransactionDoc, AssetTransferTransactionDoc } from "../../../../db/DocType";
import { Link } from "react-router-dom";
import { TypeBadge } from "../../../utils/TypeBadge/TypeBadge";

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
            <Table striped={true} className="data-table">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Type</th>
                        <th style={{ width: '25%' }}>Hash</th>
                        <th style={{ width: '25%' }}>Assets</th>
                        <th style={{ width: '15%' }}>Amount</th>
                        <th style={{ width: '15%' }}>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        _.flatMap(_.reverse(_.values(blocksByNumber)), block => {
                            return _.chain(block.parcels).filter(parcel => Type.isChangeShardStateDoc(parcel.action))
                                .flatMap(parcel => (parcel.action as ChangeShardStateDoc).transactions)
                                .map(transaction => {
                                    return (
                                        <tr key={`home-transaction-hash-${transaction.data.hash}`}>
                                            <td><TypeBadge transaction={transaction} /> </td>
                                            <td scope="row"><HexString link={`/tx/0x${transaction.data.hash}`} text={transaction.data.hash} /></td>
                                            <td>{Type.isAssetMintTransactionDoc(transaction) ?
                                                <span><img className="icon" src={Type.getMetadata((transaction as AssetMintTransactionDoc).data.metadata).icon_url} /><HexString link={`/asset/${(transaction as AssetMintTransactionDoc).data.output.assetType}`} text={(transaction as AssetMintTransactionDoc).data.output.assetType} /></span>
                                                : (Type.isAssetTransferTransactionDoc(transaction) ? <span><img className="icon" src={Type.getMetadata((transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetScheme.metadata).icon_url} /><HexString link={`/asset/0x${(transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetType}`} text={(transaction as AssetTransferTransactionDoc).data.inputs[0].prevOut.assetType} /></span> : "")}</td>
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
                    <Link to={"/txs"}>
                        <button type="button" className="btn btn-primary w-100">
                            <span>View all transactions</span>
                        </button>
                    </Link>
                </div>
            }
        </div>
    </div>
};

export default LatestTransactions;
