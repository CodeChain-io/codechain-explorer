import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from "reactstrap";
import * as FontAwesome from "react-fontawesome";

import "./PendingParcelTable.scss";
import { PendingParcelDoc, Type, ChangeShardStateDoc } from "../../../../db/DocType";
import { Link } from "react-router-dom";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";
import { ActionBadge } from "../../util/ActionBadge/ActionBadge";
import HexString from "../../util/HexString/HexString";

interface Prop {
    pendingParcels: PendingParcelDoc[];
}

interface State {
    itemPerPage: number,
    currentPage: number,
    // fee : 0, txs: 1, pending duration: 2
    currentSortType: number,
    isASC: boolean,
    currentSenderFilter: string,
    isSenderFilterOn: boolean
}

class PendingParcelTable extends React.Component<Prop, State> {
    constructor(props: Prop) {
        super(props);
        this.state = {
            currentPage: 1,
            itemPerPage: 5,
            currentSortType: 2,
            isASC: true,
            currentSenderFilter: "",
            isSenderFilterOn: false
        };
    }

    public render() {
        const { pendingParcels } = this.props;
        const { currentPage, itemPerPage, isSenderFilterOn } = this.state;
        const filteredParcel = this.filterListBySender(pendingParcels);
        const sortedParcels = this.sortListBySortType(filteredParcel);
        const maxPage = Math.floor(Math.max(0, filteredParcel.length - 1) / itemPerPage) + 1;
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
                            <span> entries</span>
                        </div>
                    </div>
                    <div>
                        <Table striped={true} className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '20%' }}>Hash</th>
                                    <th style={{ width: '20%' }}>Signer</th>
                                    <th style={{ width: '10%' }} className="sort-header" onClick={_.partial(this.handleSortButton, 0)}>Fee{this.getSortButton(0)}</th>
                                    <th style={{ width: '10%' }} className="sort-header" onClick={_.partial(this.handleSortButton, 1)}>Txs{this.getSortButton(1)}</th>
                                    <th style={{ width: '20%' }} className="sort-header" onClick={_.partial(this.handleSortButton, 2)}>Pending duration{this.getSortButton(2)}</th>
                                    <th style={{ width: '20%' }}>Estimated ...</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    _.map(sortedParcels.slice((currentPage - 1) * itemPerPage, (currentPage - 1) * itemPerPage + itemPerPage), (pendingParcel, index) => {
                                        return (
                                            <tr key={`pending-parcel-${pendingParcel.parcel.hash}`}>
                                                <td><ActionBadge parcel={pendingParcel.parcel} simple={true} /><HexString text={pendingParcel.parcel.hash} /></td>
                                                <td><FontAwesome className={`filter ${isSenderFilterOn ? "" : "disable"}`} onClick={_.partial(this.toogleFilter, pendingParcel.parcel.sender)} name="filter" /><Link to={`/addr-platform/${PlatformAddress.fromAccountId(pendingParcel.parcel.sender).value}`}>{PlatformAddress.fromAccountId(pendingParcel.parcel.sender).value}</Link></td>
                                                <td>{pendingParcel.parcel.fee.toLocaleString()}</td>
                                                <td>{Type.isChangeShardStateDoc(pendingParcel.parcel.action) ? (pendingParcel.parcel.action as ChangeShardStateDoc).transactions.length.toLocaleString() : 0}</td>
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
                        <div className="d-inline ml-auto pager">
                            <ul className="list-inline">
                                <li className="list-inline-item">
                                    <button className={`btn btn-primary page-btn ${currentPage === 1 ? "disabled" : ""}`} type="button" onClick={this.moveFirst}>&lt;&lt;</button>
                                </li>
                                <li className="list-inline-item">
                                    <button className={`btn btn-primary page-btn ${currentPage === 1 ? "disabled" : ""}`} type="button" onClick={this.moveBefore}>&lt; Prev</button>
                                </li>
                                <li className="list-inline-item">
                                    <div className="number-view">
                                        {currentPage} of {maxPage}
                                    </div>
                                </li>
                                <li className="list-inline-item">
                                    <button className={`btn btn-primary page-btn ${currentPage === maxPage ? "disabled" : ""}`} type="button" onClick={_.partial(this.moveNext, maxPage)}>Next &gt;</button>
                                </li>
                                <li className="list-inline-item">
                                    <button className={`btn btn-primary page-btn ${currentPage === maxPage ? "disabled" : ""}`} type="button" onClick={_.partial(this.moveLast, maxPage)}>&gt;&gt;</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    private toogleFilter = (sender: string, e: any) => {
        if (this.state.isSenderFilterOn) {
            this.setState({ isSenderFilterOn: false, currentSenderFilter: "" });
        } else {
            this.setState({ isSenderFilterOn: true, currentSenderFilter: sender });
        }
    }

    private filterListBySender = (pendingParcels: PendingParcelDoc[]) => {
        if (!this.state.isSenderFilterOn) {
            return pendingParcels;
        }
        return _.filter(pendingParcels, (pendingParcel: PendingParcelDoc) => {
            return pendingParcel.parcel.sender === this.state.currentSenderFilter;
        });
    }

    private sortListBySortType = (pendingParcels: PendingParcelDoc[]) => {
        const currentSortType = this.state.currentSortType;
        return _.orderBy(pendingParcels, (pendingParcel: PendingParcelDoc) => {
            if (currentSortType === 0) {
                return pendingParcel.parcel.fee;
            } else if (currentSortType === 1) {
                if (Type.isChangeShardStateDoc(pendingParcel.parcel.action)) {
                    return (pendingParcel.parcel.action as ChangeShardStateDoc).transactions.length;
                } else {
                    return 0;
                }
            } else {
                return pendingParcel.timestamp;
            }
        }, this.state.isASC ? ["asc"] : ["desc"])
    }

    private handleSortButton = (sortType: number) => {
        if (sortType === this.state.currentSortType) {
            this.setState({ isASC: !this.state.isASC });
        } else {
            this.setState({ currentSortType: sortType });
            this.setState({ isASC: true });
        }
    }

    private getSortButton = (sortType: number) => {
        return (
            <div className={`d-inline sort-btn ${this.state.currentSortType !== sortType ? "disable" : ""}`}>
                {
                    this.state.currentSortType === sortType ?
                        (this.state.isASC ? <FontAwesome name="caret-up" /> : <FontAwesome name="caret-down" />)
                        : <FontAwesome name="caret-down" />
                }
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
        const selected = parseInt(event.target.value, 10);
        this.setState({ itemPerPage: selected, currentPage: 1 });
    }
}

export default PendingParcelTable;
