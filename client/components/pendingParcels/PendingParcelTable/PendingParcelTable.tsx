import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from 'reactstrap';
import * as FontAwesome from "react-fontawesome";

import "./PendingParcelTable.scss";
import { PendingParcelDoc, Type, ChangeShardStateDoc } from "../../../db/DocType";
import HexString from "../../util/HexString/HexString";

interface Prop {
    pendingParcels: PendingParcelDoc[];
}

interface State {
    itemPerPage: number,
    currentPage: number
}

class PendingParcelTable extends React.Component<Prop, State> {
    constructor(props: Prop) {
        super(props);
        this.state = {
            currentPage: 1,
            itemPerPage: 5
        };
    }

    public render() {
        const { pendingParcels } = this.props;
        const { currentPage, itemPerPage } = this.state;
        const filteredParcel = pendingParcels;
        const sortedParcels = filteredParcel;
        const maxPage = Math.floor(filteredParcel.length / itemPerPage) + 1;
        return (
            <div className="pending-parcel-table">
                <div>
                    <div>
                        <div className="float-right">
                            <span>Show </span>
                            <select onChange={this.handleOptionChange} defaultValue={itemPerPage.toString()}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
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
                                    _.map(sortedParcels.slice((currentPage - 1) * itemPerPage, (currentPage - 1) * itemPerPage + itemPerPage), (pendingParcel, index) => {
                                        return (
                                            <tr key={`pending-parcel-${pendingParcel.parcel.hash}-${index}`}>
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
                                <li className={`list-inline-item page-btn ${currentPage === 1 ? "disable" : ""}`} onClick={this.moveFirst}>
                                    &lt;&lt;
                                </li>
                                <li className={`list-inline-item page-btn ${currentPage === 1 ? "disable" : ""}`} onClick={this.moveBefore}>
                                    &lt; Prev
                                </li>
                                <li className="list-inline-item">
                                    {currentPage} of {maxPage}
                                </li>
                                <li className={`list-inline-item page-btn ${currentPage === maxPage ? "disable" : ""}`} onClick={_.partial(this.moveNext, maxPage)}>
                                    Next &gt;
                                </li>
                                <li className={`list-inline-item page-btn ${currentPage === maxPage ? "disable" : ""}`} onClick={_.partial(this.moveLast, maxPage)}>
                                    &gt;&gt;
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    private moveNext = (maxPage: number, e: any) => {
        e.preventDefault();
        if (this.state.currentPage >= maxPage) {
            return;
        }
        this.setState({ currentPage: this.state.currentPage + 1 })
    }

    private moveLast = (maxPage: number, e: any) => {
        e.preventDefault();
        if (this.state.currentPage >= maxPage) {
            return;
        }
        this.setState({ currentPage: maxPage })
    }

    private moveBefore = (e: any) => {
        e.preventDefault();
        if (this.state.currentPage <= 1) {
            return;
        }
        this.setState({ currentPage: this.state.currentPage - 1 })
    }

    private moveFirst = (e: any) => {
        if (this.state.currentPage <= 1) {
            return;
        }
        this.setState({ currentPage: 1 })
    }

    private handleOptionChange = (event: any) => {
        const selected = event.target.value;
        this.setState({ itemPerPage: selected, currentPage: 1 });
    }
}

export default PendingParcelTable;
