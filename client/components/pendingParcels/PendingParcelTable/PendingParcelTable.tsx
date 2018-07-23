import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';

import "./PendingParcelTable.scss";
import { PendingParcelDoc, Type, ChangeShardStateDoc } from "../../../db/DocType";
import HexString from "../../util/HexString/HexString";

interface Prop {
    pendingParcels: PendingParcelDoc[];
}

class PendingParcelTable extends React.Component<Prop, {}> {
    constructor(props: Prop) {
        super(props);
    }

    public render() {
        const { pendingParcels } = this.props;
        return (
            <div className="pending-parcel-table">
                <div>
                    <div>
                        <div className="float-right">
                            <span>Show </span>
                            <select>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="40">40</option>
                                <option value="50">50</option>
                            </select>
                            <span> entities</span>
                        </div>
                    </div>
                    <div>
                        <Table striped={true}>
                            <thead>
                                <tr>
                                    <th>Hash</th>
                                    <th>Signer</th>
                                    <th>Fee</th>
                                    <th>Txs</th>
                                    <th>Pending duration</th>
                                    <th>Estimated ...</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    _.map(pendingParcels, pendingParcel => {
                                        return (
                                            <tr key={`pending-parcel-${pendingParcel.parcel.hash}`}>
                                                <td><span className={`type-circle ${Type.isChangeShardStateDoc(pendingParcel.parcel.action) ? "change-shard-state-type" : (Type.isPaymentDoc(pendingParcel.parcel.action) ? "payment-type" : "set-regular-key-type")}`}>&nbsp;</span><HexString link={`/parcel/0x${pendingParcel.parcel.hash}`} text={pendingParcel.parcel.hash} /></td>
                                                <td><HexString link={`/addr-platform/0x${pendingParcel.parcel.sender}`} text={pendingParcel.parcel.sender} /></td>
                                                <td>{pendingParcel.parcel.fee}</td>
                                                <td>{Type.isChangeShardStateDoc(pendingParcel.parcel.action) ? (pendingParcel.parcel.action as ChangeShardStateDoc).transactions.length : 0}</td>
                                                <td>{moment.unix(pendingParcel.timestamp).fromNow()}</td>
                                                <td>?</td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </Table>
                    </div>
                    <div className="d-flex mt-3">
                        <div className="d-inline mr-auto">
                            Found {pendingParcels.length} Parcels
                        </div>
                        <div className="d-inline">
                            <ul className="list-inline">
                                <li className="list-inline-item page-btn">
                                    &lt;&lt;
                                </li>
                                <li className="list-inline-item page-btn">
                                    &lt; Prev
                                </li>
                                <li className="list-inline-item">
                                    1 of 1
                                </li>
                                <li className="list-inline-item page-btn">
                                    Next &gt;
                                </li>
                                <li className="list-inline-item page-btn">
                                    &gt;&gt;
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PendingParcelTable;
