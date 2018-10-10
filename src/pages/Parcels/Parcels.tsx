import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { Redirect } from "react-router";
import { Container } from "reactstrap";

import { ParcelDoc } from "codechain-es/lib/types";
import { Link } from "react-router-dom";
import { ActionBadge } from "../../components/util/ActionBadge/ActionBadge";
import { CommaNumberString } from "../../components/util/CommaNumberString/CommaNumberString";
import DataTable from "../../components/util/DataTable/DataTable";
import HexString from "../../components/util/HexString/HexString";
import { RequestParcels, RequestTotalParcelCount } from "../../request";
import { changeQuarkStringToCCC } from "../../utils/Formatter";
import "./Parcels.scss";

interface State {
    parcels: ParcelDoc[];
    totalParcelCount?: number;
    isParcelRequested: boolean;
    redirect: boolean;
    redirectPage?: number;
    redirectItemsPerPage?: number;
}

interface Props {
    location: {
        search: string;
    };
}

class Parcels extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            parcels: [],
            totalParcelCount: undefined,
            isParcelRequested: false,
            redirect: false,
            redirectItemsPerPage: undefined,
            redirectPage: undefined
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
                isParcelRequested: false,
                redirect: false,
                redirectPage: undefined,
                redirectItemsPerPage: undefined
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
        const lastBlockNumber = params.get("lastBlockNumber")
            ? parseInt(params.get("lastBlockNumber") as string, 10)
            : undefined;
        const lastParcelIndex = params.get("lastParcelIndex")
            ? parseInt(params.get("lastParcelIndex") as string, 10)
            : undefined;
        const {
            parcels,
            totalParcelCount,
            isParcelRequested,
            redirect,
            redirectItemsPerPage,
            redirectPage
        } = this.state;

        if (redirect) {
            return redirectPage && redirectPage - currentPage === 1 ? (
                <Redirect
                    push={true}
                    to={`/parcels?page=${redirectPage || currentPage}&itemsPerPage=${redirectItemsPerPage ||
                        itemsPerPage}&lastBlockNumber=${
                        parcels.length > 0 ? parcels[parcels.length - 1].blockNumber : undefined
                    }&lastParcelIndex=${parcels.length > 0 ? parcels[parcels.length - 1].parcelIndex : undefined}`}
                />
            ) : (
                <Redirect
                    push={true}
                    to={`/parcels?page=${redirectPage || currentPage}&itemsPerPage=${redirectItemsPerPage ||
                        itemsPerPage}`}
                />
            );
        }
        if (totalParcelCount === undefined) {
            return <RequestTotalParcelCount onParcelTotalCount={this.onTotalParcelCount} onError={this.onError} />;
        }
        const maxPage = Math.floor(Math.max(0, totalParcelCount - 1) / itemsPerPage) + 1;
        return (
            <Container className="parcels">
                {!isParcelRequested ? (
                    <RequestParcels
                        onParcels={this.onParcels}
                        page={currentPage}
                        itemsPerPage={itemsPerPage}
                        onError={this.onError}
                        lastBlockNumber={lastBlockNumber}
                        lastParcelIndex={lastParcelIndex}
                    />
                ) : null}
                <h1>Latest parcels</h1>
                <div className="parcel-table">
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
                                        <th style={{ width: "20%" }}>Type</th>
                                        <th style={{ width: "25%" }}>Hash</th>
                                        <th style={{ width: "20%" }}>Signer</th>
                                        <th style={{ width: "15%" }}>Fee</th>
                                        <th style={{ width: "20%" }}>Last seen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {_.map(parcels, parcel => {
                                        return (
                                            <tr key={`parcel-${parcel.hash}`}>
                                                <td>
                                                    <ActionBadge parcel={parcel} />
                                                </td>
                                                <td scope="row">
                                                    <HexString link={`/parcel/0x${parcel.hash}`} text={parcel.hash} />
                                                </td>
                                                <td>
                                                    <Link to={`/addr-platform/${parcel.signer}`}>{parcel.signer}</Link>
                                                </td>
                                                <td>
                                                    <CommaNumberString text={changeQuarkStringToCCC(parcel.fee)} />
                                                    CCC
                                                </td>
                                                <td>{moment.unix(parcel.timestamp).fromNow()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </DataTable>
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

    private handleOptionChange = (event: any) => {
        const selected = parseInt(event.target.value, 10);
        this.setState({
            redirectItemsPerPage: selected,
            redirect: true,
            redirectPage: 1
        });
    };

    private onTotalParcelCount = (totalParcelCount: number) => {
        this.setState({ totalParcelCount });
    };

    private onParcels = (parcels: ParcelDoc[]) => {
        this.setState({ parcels, isParcelRequested: true });
    };

    private onError = (error: any) => {
        console.log(error);
        this.setState({ parcels: [], isParcelRequested: true });
    };
}

export default Parcels;
