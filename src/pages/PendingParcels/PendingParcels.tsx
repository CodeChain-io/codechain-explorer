import {
    faAngleDoubleLeft,
    faAngleDoubleRight,
    faAngleLeft,
    faAngleRight,
    faCaretDown,
    faCaretUp,
    faFilter
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { Redirect } from "react-router";
import { Container } from "reactstrap";
import * as emptyImage from "./img/empty.png";

import { RequestPendingParcels, RequestTotalPendingParcelCount } from "../../request";

import { AssetTransactionGroupDoc, PendingParcelDoc } from "codechain-es/lib/types";
import { Type } from "codechain-es/lib/utils";
import { Link } from "react-router-dom";
import { ActionBadge } from "../../components/util/ActionBadge/ActionBadge";
import DataTable from "../../components/util/DataTable/DataTable";
import HexString from "../../components/util/HexString/HexString";
import "./PendingParcels.scss";

interface State {
    pendingParcels: PendingParcelDoc[];
    isPendingParcelRequested: boolean;
    isAssetTransactionGroupFilterOn: boolean;
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
    refreshTotalPendingParcel: boolean;
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
            isAssetTransactionGroupFilterOn: true,
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
            isASC: false,
            refreshTotalPendingParcel: false
        };
    }

    public componentWillReceiveProps(props: Props) {
        const {
            location: { search }
        } = this.props;
        const {
            location: { search: nextSearch }
        } = props;
        if (nextSearch !== search) {
            this.setState({
                isPendingParcelRequested: false,
                redirect: false,
                redirectPage: undefined,
                redirectItemsPerPage: undefined,
                refreshTotalPendingParcel: false
            });
        }
    }

    public render() {
        const {
            location: { search }
        } = this.props;
        const params = new URLSearchParams(search);
        const currentPage = params.get("page") ? parseInt(params.get("page") as string, 10) : 1;
        const itemsPerPage = params.get("itemsPerPage") ? parseInt(params.get("itemsPerPage") as string, 10) : 25;
        const {
            filteredPendingParcelCount,
            isASC,
            currentSortType,
            pendingParcels,
            totalPendingParcelCount,
            isPendingParcelRequested,
            redirect,
            redirectItemsPerPage,
            redirectPage,
            isAssetTransactionGroupFilterOn,
            isPaymentFilterOn,
            isSetRegularKeyFilterOn,
            isSenderFilterOn,
            currentSenderFilter,
            refreshTotalPendingParcel
        } = this.state;
        const actionFilters = this.getActionFilters();
        const orderBy = isASC ? "asc" : "desc";
        if (redirect) {
            return (
                <Redirect
                    push={true}
                    to={`/parcels-pending?page=${redirectPage || currentPage}&itemsPerPage=${redirectItemsPerPage ||
                        itemsPerPage}`}
                />
            );
        }
        if (totalPendingParcelCount === undefined) {
            return (
                <RequestTotalPendingParcelCount
                    onPendingParcelTotalCount={this.onPendingParcelTotalCount}
                    onError={this.onError}
                />
            );
        }
        const maxPage = Math.floor(Math.max(0, (filteredPendingParcelCount || 0) - 1) / itemsPerPage) + 1;
        return (
            <Container className="pending-parcels">
                {refreshTotalPendingParcel ? (
                    <RequestTotalPendingParcelCount
                        onPendingParcelTotalCount={this.onPendingParcelTotalCount}
                        onError={this.onError}
                    />
                ) : null}
                {filteredPendingParcelCount === undefined ? (
                    <RequestTotalPendingParcelCount
                        actionFilters={actionFilters}
                        signerFiter={currentSenderFilter}
                        onPendingParcelTotalCount={this.onFilteredPendingParcelTotalCount}
                        onError={this.onError}
                    />
                ) : null}
                {!isPendingParcelRequested ? (
                    <RequestPendingParcels
                        sorting={currentSortType}
                        orderBy={orderBy}
                        actionFilters={actionFilters}
                        signerFiter={currentSenderFilter}
                        onPendingParcels={this.onPendingParcels}
                        page={currentPage}
                        itmesPerPage={itemsPerPage}
                        onError={this.onError}
                    />
                ) : null}
                <div className="d-flex align-items-end">
                    <h1 className="d-inline mr-auto">Pending Parcels</h1>
                    <div className="d-inline">
                        <span className="total-parcel-big">
                            {filteredPendingParcelCount || 0} Pending Parcels (Total {totalPendingParcelCount})
                        </span>
                    </div>
                    <div className="d-inline">
                        <span className="total-parcel-small">{filteredPendingParcelCount || 0} Pending Parcels</span>
                    </div>
                </div>
                <div className="filter-container mt-large">
                    <div className="type-filter">
                        <div className="d-md-inline mr-4">
                            <span className="filter-item" onClick={this.toggleAssetTransactionGroupFilter}>
                                <input
                                    readOnly={true}
                                    checked={isAssetTransactionGroupFilterOn}
                                    type="checkbox"
                                    className="filter-input filter-input-asset-transaction-group"
                                />
                                <span className="filter-text">AssetTransactionGroup</span>
                            </span>
                        </div>
                        <div className="d-md-inline mr-4">
                            <span className="filter-item" onClick={this.togglePaymentFilter}>
                                <input
                                    readOnly={true}
                                    checked={isPaymentFilterOn}
                                    type="checkbox"
                                    className="filter-input filter-input-payment"
                                />
                                <span className="filter-text">Payment</span>
                            </span>
                        </div>
                        <div className="d-md-inline">
                            <span className="filter-item" onClick={this.toggleSetRegularKeyFilter}>
                                <input
                                    readOnly={true}
                                    checked={isSetRegularKeyFilterOn}
                                    type="checkbox"
                                    className="filter-input filter-input-set-regular-key"
                                />
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
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="75">75</option>
                                    <option value="100">100</option>
                                </select>
                                <span> entries</span>
                            </div>
                        </div>
                        <div>
                            <DataTable>
                                <thead>
                                    <tr>
                                        <th style={{ width: "25%" }}>Hash</th>
                                        <th style={{ width: "25%" }}>Signer</th>
                                        <th
                                            style={{ width: "15%" }}
                                            className="sort-header"
                                            onClick={_.partial(this.handleSortButton, "fee")}
                                        >
                                            Fee
                                            {this.getSortButton("fee")}
                                        </th>
                                        <th
                                            style={{ width: "15%" }}
                                            className="sort-header"
                                            onClick={_.partial(this.handleSortButton, "txs")}
                                        >
                                            Txs
                                            {this.getSortButton("txs")}
                                        </th>
                                        <th
                                            style={{ width: "20%" }}
                                            className="sort-header"
                                            onClick={_.partial(this.handleSortButton, "pendingPeriod")}
                                        >
                                            Last seen
                                            {this.getSortButton("pendingPeriod")}
                                        </th>
                                    </tr>
                                </thead>
                                {pendingParcels.length > 0 ? (
                                    <tbody>
                                        {_.map(pendingParcels, (pendingParcel, index) => {
                                            return (
                                                <tr key={`pending-parcel-${pendingParcel.parcel.hash}`}>
                                                    <td>
                                                        <ActionBadge parcel={pendingParcel.parcel} simple={true} />
                                                        <HexString
                                                            text={pendingParcel.parcel.hash}
                                                            link={`/parcel/0x${pendingParcel.parcel.hash}`}
                                                        />
                                                    </td>
                                                    <td>
                                                        <span
                                                            onClick={_.partial(
                                                                this.toogleFilter,
                                                                pendingParcel.parcel.signer
                                                            )}
                                                        >
                                                            <FontAwesomeIcon
                                                                className={`filter ${
                                                                    isSenderFilterOn ? "" : "disable"
                                                                }`}
                                                                icon={faFilter}
                                                            />
                                                        </span>
                                                        <Link to={`/addr-platform/${pendingParcel.parcel.signer}`}>
                                                            {pendingParcel.parcel.signer}
                                                        </Link>
                                                    </td>
                                                    <td>{pendingParcel.parcel.fee.toLocaleString()}</td>
                                                    <td>
                                                        {Type.isAssetTransactionGroupDoc(pendingParcel.parcel.action)
                                                            ? (pendingParcel.parcel
                                                                  .action as AssetTransactionGroupDoc).transactions.length.toLocaleString()
                                                            : 0}
                                                    </td>
                                                    <td>{moment.unix(pendingParcel.timestamp).fromNow()}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                ) : null}
                            </DataTable>
                            {pendingParcels.length === 0 ? (
                                <div className="empty-container align-items-center justify-content-center">
                                    <img className="empty-icon" src={emptyImage} />
                                    <div>
                                        <h3>Empty!</h3>
                                        <span>There is no data to display.</span>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <div className="d-flex mt-small">
                            <div className="d-inline ml-auto pager">
                                <ul className="list-inline">
                                    <li className="list-inline-item">
                                        <button
                                            disabled={currentPage === 1}
                                            className={`btn btn-primary page-btn ${
                                                currentPage === 1 ? "disabled" : ""
                                            }`}
                                            type="button"
                                            onClick={_.partial(this.moveFirst, currentPage)}
                                        >
                                            <FontAwesomeIcon icon={faAngleDoubleLeft} />
                                        </button>
                                    </li>
                                    <li className="list-inline-item">
                                        <button
                                            disabled={currentPage === 1}
                                            className={`btn btn-primary page-btn ${
                                                currentPage === 1 ? "disabled" : ""
                                            }`}
                                            type="button"
                                            onClick={_.partial(this.moveBefore, currentPage)}
                                        >
                                            <FontAwesomeIcon icon={faAngleLeft} /> Prev
                                        </button>
                                    </li>
                                    <li className="list-inline-item">
                                        <div className="number-view">
                                            {currentPage} of {maxPage}
                                        </div>
                                    </li>
                                    <li className="list-inline-item">
                                        <button
                                            disabled={currentPage === maxPage}
                                            className={`btn btn-primary page-btn ${
                                                currentPage === maxPage ? "disabled" : ""
                                            }`}
                                            type="button"
                                            onClick={_.partial(this.moveNext, currentPage, maxPage)}
                                        >
                                            Next <FontAwesomeIcon icon={faAngleRight} />
                                        </button>
                                    </li>
                                    <li className="list-inline-item">
                                        <button
                                            disabled={currentPage === maxPage}
                                            className={`btn btn-primary page-btn ${
                                                currentPage === maxPage ? "disabled" : ""
                                            }`}
                                            type="button"
                                            onClick={_.partial(this.moveLast, currentPage, maxPage)}
                                        >
                                            <FontAwesomeIcon icon={faAngleDoubleRight} />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    private getActionFilters = () => {
        const actionFilters: string[] = [];
        if (this.state.isPaymentFilterOn) {
            actionFilters.push("payment");
        }
        if (this.state.isAssetTransactionGroupFilterOn) {
            actionFilters.push("assetTransactionGroup");
        }
        if (this.state.isSetRegularKeyFilterOn) {
            actionFilters.push("setRegularKey");
        }
        return actionFilters;
    };

    private moveNext = (currentPage: number, maxPage: number, e: any) => {
        e.preventDefault();
        if (currentPage >= maxPage) {
            return;
        }
        this.setState({ redirectPage: currentPage + 1, redirect: true });
    };

    private moveLast = (currentPage: number, maxPage: number, e: any) => {
        e.preventDefault();
        if (currentPage >= maxPage) {
            return;
        }
        this.setState({ redirectPage: maxPage, redirect: true });
    };

    private moveBefore = (currentPage: number, e: any) => {
        e.preventDefault();
        if (currentPage <= 1) {
            return;
        }
        this.setState({ redirectPage: currentPage - 1, redirect: true });
    };

    private moveFirst = (currentPage: number, e: any) => {
        if (currentPage <= 1) {
            return;
        }
        this.setState({ redirectPage: 1, redirect: true });
    };

    private toggleAssetTransactionGroupFilter = () => {
        this.setState({
            isAssetTransactionGroupFilterOn: !this.state.isAssetTransactionGroupFilterOn,
            filteredPendingParcelCount: undefined,
            isPendingParcelRequested: false,
            refreshTotalPendingParcel: true
        });
    };

    private togglePaymentFilter = () => {
        this.setState({
            isPaymentFilterOn: !this.state.isPaymentFilterOn,
            filteredPendingParcelCount: undefined,
            isPendingParcelRequested: false,
            refreshTotalPendingParcel: true
        });
    };

    private toggleSetRegularKeyFilter = () => {
        this.setState({
            isSetRegularKeyFilterOn: !this.state.isSetRegularKeyFilterOn,
            filteredPendingParcelCount: undefined,
            isPendingParcelRequested: false,
            refreshTotalPendingParcel: true
        });
    };

    private onPendingParcels = (pendingParcels: PendingParcelDoc[]) => {
        this.setState({ pendingParcels, isPendingParcelRequested: true });
    };

    private onPendingParcelTotalCount = (pendingParcelTotalCount: number) => {
        this.setState({ totalPendingParcelCount: pendingParcelTotalCount, refreshTotalPendingParcel: false });
    };

    private onFilteredPendingParcelTotalCount = (pendingParcelTotalCount: number) => {
        this.setState({ filteredPendingParcelCount: pendingParcelTotalCount });
    };

    private toogleFilter = (sender: string, e: any) => {
        if (this.state.isSenderFilterOn) {
            this.setState({
                isSenderFilterOn: false,
                currentSenderFilter: "",
                filteredPendingParcelCount: undefined,
                isPendingParcelRequested: false,
                refreshTotalPendingParcel: true
            });
        } else {
            this.setState({
                isSenderFilterOn: true,
                currentSenderFilter: sender,
                filteredPendingParcelCount: undefined,
                isPendingParcelRequested: false,
                refreshTotalPendingParcel: true
            });
        }
    };

    private handleSortButton = (sortType: string) => {
        if (sortType === this.state.currentSortType) {
            this.setState({
                isASC: !this.state.isASC,
                filteredPendingParcelCount: undefined,
                isPendingParcelRequested: false
            });
        } else {
            this.setState({
                currentSortType: sortType,
                isASC: true,
                filteredPendingParcelCount: undefined,
                isPendingParcelRequested: false
            });
        }
    };

    private getSortButton = (sortType: string) => {
        return (
            <div className={`d-inline sort-btn ${this.state.currentSortType !== sortType ? "disable" : ""}`}>
                {this.state.currentSortType === sortType ? (
                    this.state.isASC ? (
                        <FontAwesomeIcon icon={faCaretUp} />
                    ) : (
                        <FontAwesomeIcon icon={faCaretDown} />
                    )
                ) : (
                    <FontAwesomeIcon icon={faCaretDown} />
                )}
            </div>
        );
    };

    private handleOptionChange = (event: any) => {
        const selected = parseInt(event.target.value, 10);
        this.setState({
            redirectItemsPerPage: selected,
            redirect: true,
            redirectPage: 1
        });
    };

    private onError = (error: any) => {
        console.log(error);
        this.setState({ isPendingParcelRequested: true });
    };
}

export default PendingParcels;
