import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { Table } from "reactstrap";

import "./ParcelTable.scss";
import { ParcelDoc } from "../../../../db/DocType";
import HexString from "../../util/HexString/HexString";
import { Link } from "react-router-dom";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";
import { ActionBadge } from "../../../utils/ActionBadge/ActionBadge";

interface Prop {
    parcels: ParcelDoc[];
}

interface State {
    itemPerPage: number,
    currentPage: number
}

class ParcelTable extends React.Component<Prop, State> {
    constructor(props: Prop) {
        super(props);
        this.state = {
            currentPage: 1,
            itemPerPage: 5
        };
    }

    public render() {
        const { parcels } = this.props;
        const { currentPage, itemPerPage } = this.state;
        const maxPage = Math.floor(Math.max(0, parcels.length - 1) / itemPerPage) + 1;
        return (
            <div className="parcel-table">
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
                                    <th style={{ width: '20%' }}>Type</th>
                                    <th style={{ width: '25%' }}>Hash</th>
                                    <th style={{ width: '20%' }}>Signer</th>
                                    <th style={{ width: '15%' }}>Fee</th>
                                    <th style={{ width: '20%' }}>Age</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    _.map(parcels.slice((currentPage - 1) * itemPerPage, (currentPage - 1) * itemPerPage + itemPerPage), (parcel) => {
                                        return (
                                            <tr key={`parcel-${parcel.hash}`}>
                                                <td><ActionBadge parcel={parcel} /></td>
                                                <td scope="row"><HexString link={`/parcel/0x${parcel.hash}`} text={parcel.hash} /></td>
                                                <td><Link to={`/addr-platform/${PlatformAddress.fromAccountId(parcel.sender).value}`}>{PlatformAddress.fromAccountId(parcel.sender).value}</Link></td>
                                                <td>{parcel.fee.toLocaleString()}</td>
                                                <td>{moment.unix(parcel.timestamp).fromNow()}</td>
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

export default ParcelTable;
