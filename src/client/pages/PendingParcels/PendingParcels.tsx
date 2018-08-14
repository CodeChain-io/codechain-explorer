import * as React from "react";
import * as _ from "lodash";
import * as moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faCaretUp, faCaretDown, faAngleDoubleLeft, faAngleLeft, faAngleDoubleRight, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Container, Table } from "reactstrap";
import { Redirect } from "react-router";

import { RequestPendingParcels, RequestTotalPendingParcelCount } from "../../request";

import "./PendingParcels.scss";
import { PendingParcelDoc, Type, ChangeShardStateDoc } from "../../../db/DocType";
import { ActionBadge } from "../../components/util/ActionBadge/ActionBadge";
import HexString from "../../components/util/HexString/HexString";
import { Link } from "react-router-dom";
import { PlatformAddress } from "codechain-sdk/lib/key/classes";

interface State {
    pendingParcels: PendingParcelDoc[];
    isPendingParcelRequested: boolean;
    isChangeShardStateFilterOn: boolean;
    isPaymentFilterOn: boolean;
    isSetRegularKeyFilterOn: boolean;
    redirect: boolean;
    redirectPage?: number;
    redirectItemsPerPage?: number;
    totalPendingParcelCount?: number;
    filteredPendingParcelCount?: number;
    isSenderFilterOn: boolean;
    currentSenderFilter?: string;
    currentSortType: string;
    isASC: boolean;
}

interface Props {
    location: {
        search: string;
    };
}

class PendingParcels extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            pendingParcels: [],
            isChangeShardStateFilterOn: true,
            isPaymentFilterOn: true,
            isSetRegularKeyFilterOn: true,
            isPendingParcelRequested: false,
            totalPendingParcelCount: undefined,
            filteredPendingParcelCount: undefined,
            redirectItemsPerPage: undefined,
            redirectPage: undefined,
            redirect: false,
            isSenderFilterOn: false,
            currentSortType: "pendingPeriod",
            currentSenderFilter: undefined,
            isASC: false
        };
    }

    public componentWillReceiveProps(props: Props) {
        const { location: { search } } = this.props;
        const { location: { search: nextSearch } } = props;
        if (nextSearch !== search) {
            this.setState({ isPendingParcelRequested: false, redirect: false, redirectPage: undefined, redirectItemsPerPage: undefined });
        }
    }

    public render() {
        const { location: { search } } = this.props;
        const params = new URLSearchParams(search);
        const currentPage = params.get('page') ? parseInt((params.get('page') as string), 10) : 1;
        const itemsPerPage = params.get('itemsPerPage') ? parseInt((params.get('itemsPerPage') as string), 10) : 5
        const { filteredPendingParcelCount, isASC, currentSortType, pendingParcels, totalPendingParcelCount, isPendingParcelRequested, redirect, redirectItemsPerPage, redirectPage, isChangeShardStateFilterOn, isPaymentFilterOn, isSetRegularKeyFilterOn, isSenderFilterOn, currentSenderFilter } = this.state;
        const actionFilters = this.getActionFilters();
        const orderBy = isASC ? "asc" : "desc";
        if (redirect) {
            return <Redirect push={true} to={`/parcels-pending?page=${redirectPage || currentPage}&itemsPerPage=${redirectItemsPerPage || itemsPerPage}`} />;
        }
        if (totalPendingParcelCount === undefined) {
            return <RequestTotalPendingParcelCount actionFilters={actionFilters} onPendingParcelTotalCount={this.onPendingParcelTotalCount} onError={this.onError} />;
        }
        const maxPage = Math.floor(Math.max(0, (filteredPendingParcelCount || 0) - 1) / itemsPerPage) + 1;
        return (
            <Container className="pending-parcels">
                {
                    filteredPendingParcelCount === undefined ?
                        <RequestTotalPendingParcelCount actionFilters={actionFilters} signerFiter={currentSenderFilter} onPendingParcelTotalCount={this.onFilteredPendingParcelTotalCount} onError={this.onError} />
                        : null
                }
                {
                    !isPendingParcelRequested ?
                        <RequestPendingParcels sorting={currentSortType} orderBy={orderBy} actionFilters={actionFilters} signerFiter={currentSenderFilter} onPendingParcels={this.onPendingParcels} page={currentPage} itmesPerPage={itemsPerPage} onError={this.onError} />
                        : null
                }
                <div className="d-flex align-items-end">
                    <h1 className="d-inline mr-auto">Pending Parcels</h1>
                    <div className="d-inline"><span className="total-parcel-big">{filteredPendingParcelCount || 0} Pending Parcels (Total {totalPendingParcelCount})</span></div>
                    <div className="d-inline"><span className="total-parcel-small">{filteredPendingParcelCount || 0} Pending Parcels</span></div>
                </div>
                <div className="filter-container mt-large">
                    <div className="type-filter">
                        <div className="d-md-inline mr-4">
                            <span className="filter-item" onClick={this.toggleChangeShardStateFilter}>
                                <input readOnly={true} checked={isChangeShardStateFilterOn} type="checkbox" className="filter-input" />
                                <span className="filter-text">ChangeShardState</span>
                            </span>
                        </div>
                        <div className="d-md-inline mr-4">
                            <span className="filter-item" onClick={this.togglePaymentFilter}>
                                <input readOnly={true} checked={isPaymentFilterOn} type="checkbox" className="filter-input" />
                                <span className="filter-text">Payment</span>
                            </span>
                        </div>
                        <div className="d-md-inline">
                            <span className="filter-item" onClick={this.toggleSetRegularKeyFilter}>
                                <input readOnly={true} checked={isSetRegularKeyFilterOn} type="checkbox" className="filter-input" />
                                <span className="filter-text">SetRegularKey</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="pending-parcel-table">
                    <div>
                        <div>
                            <div className="float-right">
                                <span>Show </span>
                                <select onChange={this.handleOptionChange} defaultValue={itemsPerPage.toString()}>
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
                                        <th style={{ width: '10%' }} className="sort-header" onClick={_.partial(this.handleSortButton, "fee")}>Fee{this.getSortButton("fee")}</th>
                                        <th style={{ width: '10%' }} className="sort-header" onClick={_.partial(this.handleSortButton, "txs")}>Txs{this.getSortButton("txs")}</th>
                                        <th style={{ width: '20%' }} className="sort-header" onClick={_.partial(this.handleSortButton, "pendingPeriod")}>Pending Period{this.getSortButton("pendingPeriod")}</th>
                                        <th style={{ width: '20%' }}>Estimated Confirmation Period</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        _.map(pendingParcels, (pendingParcel, index) => {
                                            return (
                                                <tr key={`pending-parcel-${pendingParcel.parcel.hash}`}>
                                                    <td><ActionBadge parcel={pendingParcel.parcel} simple={true} /><HexString text={pendingParcel.parcel.hash} link={`/parcel/0x${pendingParcel.parcel.hash}`} /></td>
                                                    <td><span onClick={_.partial(this.toogleFilter, pendingParcel.parcel.sender)}><FontAwesomeIcon className={`filter ${isSenderFilterOn ? "" : "disable"}`} icon={faFilter} /></span><Link to={`/addr-platform/${PlatformAddress.fromAccountId(pendingParcel.parcel.sender).value}`}>{PlatformAddress.fromAccountId(pendingParcel.parcel.sender).value}</Link></td>
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
                        <div className="d-flex mt-small">
                            <div className="d-inline ml-auto pager">
                                <ul className="list-inline">
                                    <li className="list-inline-item">
                                        <button disabled={currentPage === 1} className={`btn btn-primary page-btn ${currentPage === 1 ? "disabled" : ""}`} type="button" onClick={_.partial(this.moveFirst, currentPage)}><FontAwesomeIcon icon={faAngleDoubleLeft} /></button>
                                    </li>
                                    <li className="list-inline-item">
                                        <button disabled={currentPage === 1} className={`btn btn-primary page-btn ${currentPage === 1 ? "disabled" : ""}`} type="button" onClick={_.partial(this.moveBefore, currentPage)}><FontAwesomeIcon icon={faAngleLeft} /> Prev</button>
                                    </li>
                                    <li className="list-inline-item">
                                        <div className="number-view">
                                            {currentPage} of {maxPage}
                                        </div>
                                    </li>
                                    <li className="list-inline-item">
                                        <button disabled={currentPage === maxPage} className={`btn btn-primary page-btn ${currentPage === maxPage ? "disabled" : ""}`} type="button" onClick={_.partial(this.moveNext, currentPage, maxPage)}>Next <FontAwesomeIcon icon={faAngleRight} /></button>
                                    </li>
                                    <li className="list-inline-item">
                                        <button disabled={currentPage === maxPage} className={`btn btn-primary page-btn ${currentPage === maxPage ? "disabled" : ""}`} type="button" onClick={_.partial(this.moveLast, currentPage, maxPage)}><FontAwesomeIcon icon={faAngleDoubleRight} /></button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        )
    }

    private getActionFilters = () => {
        const actionFilters: string[] = [];
        if (this.state.isPaymentFilterOn) {
            actionFilters.push("payment");
        }
        if (this.state.isChangeShardStateFilterOn) {
            actionFilters.push("changeShardState");
        }
        if (this.state.isSetRegularKeyFilterOn) {
            actionFilters.push("setRegularKey");
        }
        return actionFilters;
    }

    private moveNext = (currentPage: number, maxPage: number, e: any) => {
        e.preventDefault();
        if (currentPage >= maxPage) {
            return;
        }
        this.setState({ redirectPage: currentPage + 1, redirect: true });
    }

    private moveLast = (currentPage: number, maxPage: number, e: any) => {
        e.preventDefault();
        if (currentPage >= maxPage) {
            return;
        }
        this.setState({ redirectPage: maxPage, redirect: true })
    }

    private moveBefore = (currentPage: number, e: any) => {
        e.preventDefault();
        if (currentPage <= 1) {
            return;
        }
        this.setState({ redirectPage: currentPage - 1, redirect: true })
    }

    private moveFirst = (currentPage: number, e: any) => {
        if (currentPage <= 1) {
            return;
        }
        this.setState({ redirectPage: 1, redirect: true })
    }

    private toggleChangeShardStateFilter = () => {
        this.setState({ isChangeShardStateFilterOn: !this.state.isChangeShardStateFilterOn, filteredPendingParcelCount: undefined, isPendingParcelRequested: false });
    }

    private togglePaymentFilter = () => {
        this.setState({ isPaymentFilterOn: !this.state.isPaymentFilterOn, filteredPendingParcelCount: undefined, isPendingParcelRequested: false });
    }

    private toggleSetRegularKeyFilter = () => {
        this.setState({ isSetRegularKeyFilterOn: !this.state.isSetRegularKeyFilterOn, filteredPendingParcelCount: undefined, isPendingParcelRequested: false });
    }

    private onPendingParcels = (pendingParcels: PendingParcelDoc[]) => {
        this.setState({ pendingParcels, isPendingParcelRequested: true });
    }

    private onPendingParcelTotalCount = (pendingParcelTotalCount: number) => {
        this.setState({ totalPendingParcelCount: pendingParcelTotalCount });
    }

    private onFilteredPendingParcelTotalCount = (pendingParcelTotalCount: number) => {
        this.setState({ filteredPendingParcelCount: pendingParcelTotalCount });
    }

    private toogleFilter = (sender: string, e: any) => {
        if (this.state.isSenderFilterOn) {
            this.setState({ isSenderFilterOn: false, currentSenderFilter: "", filteredPendingParcelCount: undefined, isPendingParcelRequested: false });
        } else {
            this.setState({ isSenderFilterOn: true, currentSenderFilter: sender, filteredPendingParcelCount: undefined, isPendingParcelRequested: false });
        }
    }

    private handleSortButton = (sortType: string) => {
        if (sortType === this.state.currentSortType) {
            this.setState({ isASC: !this.state.isASC, filteredPendingParcelCount: undefined, isPendingParcelRequested: false });
        } else {
            this.setState({ currentSortType: sortType, isASC: true, filteredPendingParcelCount: undefined, isPendingParcelRequested: false });
        }
    }

    private getSortButton = (sortType: string) => {
        return (
            <div className={`d-inline sort-btn ${this.state.currentSortType !== sortType ? "disable" : ""}`}>
                {
                    this.state.currentSortType === sortType ?
                        (this.state.isASC ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />)
                        : <FontAwesomeIcon icon={faCaretDown} />
                }
            </div>
        )
    }

    private handleOptionChange = (event: any) => {
        const selected = parseInt(event.target.value, 10);
        this.setState({ redirectItemsPerPage: selected, redirect: true, redirectPage: 1 });
    }

    private onError = (error: any) => {
        console.log(error);
        this.setState({ isPendingParcelRequested: true });
    };
}

export default PendingParcels;
