import { faAngleLeft, faAngleRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as React from "react";
import { Redirect } from "react-router";
import { Container } from "reactstrap";

import { TransactionDoc } from "codechain-indexer-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import { CommaNumberString } from "src/components/util/CommaNumberString/CommaNumberString";
import { RootState } from "src/redux/actions";
import RequestServerTime from "src/request/RequestServerTime";
import { TransactionsResponse } from "src/request/RequestTransactions";
import { getUnixTimeLocaleString } from "src/utils/Time";
import DataTable from "../../components/util/DataTable/DataTable";
import HexString from "../../components/util/HexString/HexString";
import { TypeBadge } from "../../components/util/TypeBadge/TypeBadge";
import { RequestTransactions } from "../../request";
import { TransactionTypes } from "../../utils/Transactions";
import "./Transactions.scss";

interface PaginationState {
    shouldMoveToNext: boolean;
    shouldMoveToPrevious: boolean;
    shouldMoveToFirst: boolean;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    firstEvaluatedKey?: string;
    lastEvaluatedKey?: string;
    itemsPerPage?: number;
}

interface State extends PaginationState {
    shouldChangeFilter: boolean;
    transactions: TransactionDoc[];
    isTransactionRequested: boolean;
    redirectFilter: string[];
    showTypeFilter: boolean;
}

interface OwnProps {
    location: {
        search: string;
    };
}

interface StateProps {
    serverTimeOffset?: number;
}
type Props = OwnProps & StateProps;

class Transactions extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            transactions: [],
            isTransactionRequested: false,
            redirectFilter: [],
            showTypeFilter: false,
            itemsPerPage: undefined,
            shouldMoveToNext: false,
            shouldMoveToPrevious: false,
            shouldMoveToFirst: false,
            shouldChangeFilter: false
        };
    }

    public componentWillReceiveProps(props: Props) {
        const {
            location: { search }
        } = this.props;
        const {
            location: { search: nextSearch }
        } = props;
        const typeFilter = new URLSearchParams(search).get("filter") !== undefined;
        if (nextSearch !== search) {
            this.setState({
                transactions: [],
                isTransactionRequested: false,
                showTypeFilter: typeFilter,
                itemsPerPage: undefined,
                shouldMoveToNext: false,
                shouldMoveToPrevious: false,
                shouldMoveToFirst: false,
                shouldChangeFilter: false
            });
        } else {
            this.setState({ showTypeFilter: typeFilter });
        }
    }

    public render() {
        const {
            location: { search },
            serverTimeOffset
        } = this.props;
        const params = new URLSearchParams(search);
        const lastEvaluatedKey = params.get("lastEvaluatedKey") || undefined;
        const firstEvaluatedKey = params.get("firstEvaluatedKey") || undefined;
        const itemsPerPage = params.get("itemsPerPage") ? parseInt(params.get("itemsPerPage") as string, 10) : 25;
        const selectedTypes = params.get("filter") ? params.get("filter")!.split(",") : [];

        const { transactions, isTransactionRequested, redirectFilter, showTypeFilter } = this.state;

        if (this.state.shouldMoveToNext) {
            return (
                <Redirect
                    push={true}
                    to={`/txs?lastEvaluatedKey=${this.state.lastEvaluatedKey}&itemsPerPage=${this.state.itemsPerPage ||
                        itemsPerPage}${
                        selectedTypes || redirectFilter ? `&filter=${redirectFilter.sort().join(",")}` : ""
                    }`}
                />
            );
        }
        if (this.state.shouldMoveToPrevious) {
            return (
                <Redirect
                    push={true}
                    to={`/txs?firstEvaluatedKey=${this.state.firstEvaluatedKey}&itemsPerPage=${this.state
                        .itemsPerPage || itemsPerPage}${
                        selectedTypes || redirectFilter ? `&filter=${redirectFilter.sort().join(",")}` : ""
                    }`}
                />
            );
        }
        if (this.state.shouldMoveToFirst || this.state.shouldChangeFilter) {
            return (
                <Redirect
                    push={true}
                    to={`/txs?itemsPerPage=${this.state.itemsPerPage || itemsPerPage}${
                        selectedTypes || redirectFilter ? `&filter=${redirectFilter.sort().join(",")}` : ""
                    }`}
                />
            );
        }

        if (serverTimeOffset === undefined) {
            return <RequestServerTime />;
        }
        return (
            <Container className="transactions">
                {!isTransactionRequested ? (
                    <div>
                        <RequestTransactions
                            onTransactions={this.onTransactions}
                            firstEvaluatedKey={firstEvaluatedKey}
                            lastEvaluatedKey={lastEvaluatedKey}
                            itemsPerPage={itemsPerPage}
                            showProgressBar={false}
                            onError={this.onError}
                            selectedTypes={selectedTypes}
                        />
                    </div>
                ) : null}
                <h1>Latest transactions</h1>
                {!showTypeFilter && (
                    <div className="show-type-filter-container">
                        <span className="filter-btn" onClick={this.showTypeFilter}>
                            Show type filter
                        </span>
                    </div>
                )}
                {showTypeFilter && (
                    <div className="type-filter-container">
                        <div className="filter-title">
                            <span>Type Filter</span>
                        </div>
                        <Row>
                            {TransactionTypes.map(type => {
                                return (
                                    <Col md={3} key={type}>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={type}
                                                checked={_.includes(selectedTypes, type)}
                                                value={type}
                                                onChange={this.handleFilterChange}
                                                disabled={!isTransactionRequested}
                                            />
                                            <label className="form-check-label" htmlFor={`${type}`}>
                                                {capitalizeFirstLetter(type)}
                                            </label>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                        <div className="hide-type-filter-container">
                            <span className="filter-btn" onClick={this.hideTypeFilter}>
                                Hide type filter
                            </span>
                        </div>
                    </div>
                )}

                <div className="d-flex align-items-end">
                    <div>
                        <div>
                            <div className="d-flex mt-small">
                                <div className="d-inline ml-auto pager">
                                    <ul className="list-inline">
                                        <li className="list-inline-item">
                                            <button
                                                disabled={
                                                    this.state.hasPreviousPage !== true || !isTransactionRequested
                                                }
                                                className={`btn btn-primary page-btn ${
                                                    this.state.hasPreviousPage !== true || !isTransactionRequested
                                                        ? "disabled"
                                                        : ""
                                                }`}
                                                type="button"
                                                onClick={this.moveBefore}
                                            >
                                                <FontAwesomeIcon icon={faAngleLeft} /> Prev
                                            </button>
                                        </li>
                                        <li className="list-inline-item">
                                            <div className="number-view" />
                                        </li>
                                        <li className="list-inline-item">
                                            <button
                                                disabled={this.state.hasNextPage !== true && !isTransactionRequested}
                                                className={`btn btn-primary page-btn ${
                                                    this.state.hasNextPage !== true && !isTransactionRequested
                                                        ? "disabled"
                                                        : ""
                                                }`}
                                                type="button"
                                                onClick={this.moveNext}
                                            >
                                                Next <FontAwesomeIcon icon={faAngleRight} />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ml-auto mb-3">
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
                <div className="transaction-table">
                    <div>
                        <div>
                            <DataTable>
                                <thead>
                                    <tr>
                                        <th style={{ width: "20%" }}>Type</th>
                                        <th style={{ width: "25%" }}>Hash</th>
                                        <th style={{ width: "15%" }} className="text-right">
                                            Fee
                                        </th>
                                        <th style={{ width: "25%" }}>Signer</th>
                                        <th style={{ width: "15%" }} className="text-right">
                                            Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!isTransactionRequested ? (
                                        <tr>
                                            <td colSpan={12}>
                                                <div className="text-center mt-12">
                                                    <FontAwesomeIcon
                                                        className="spin"
                                                        icon={faSpinner}
                                                        spin={true}
                                                        size={"2x"}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={12}>
                                                <div className="text-center mt-12">No transactions</div>
                                            </td>
                                        </tr>
                                    ) : (
                                        _.map(transactions, transaction => {
                                            return (
                                                <tr key={`transaction-${transaction.hash}`}>
                                                    <td>
                                                        <TypeBadge transaction={transaction} />{" "}
                                                    </td>
                                                    <td scope="row">
                                                        <HexString
                                                            link={`/tx/0x${transaction.hash}`}
                                                            text={transaction.hash}
                                                        />
                                                    </td>
                                                    <td className="text-right">
                                                        <CommaNumberString text={transaction.fee} />
                                                        <span className="ccc">CCC</span>
                                                    </td>
                                                    <td>
                                                        <Link to={`/addr-platform/${transaction.signer}`}>
                                                            {transaction.signer}
                                                        </Link>
                                                    </td>
                                                    <td className="text-right">
                                                        {getUnixTimeLocaleString(
                                                            transaction.timestamp!,
                                                            serverTimeOffset
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    private showTypeFilter = () => {
        this.setState({ showTypeFilter: true });
    };

    private hideTypeFilter = () => {
        this.setState({ showTypeFilter: false });
    };

    private handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            location: { search }
        } = this.props;
        const params = new URLSearchParams(search);
        const selectedTypes = params.get("filter") ? params.get("filter")!.split(",") : [];

        if (event.target.checked) {
            this.setState({
                redirectFilter: [...selectedTypes, event.target.value],
                isTransactionRequested: false,
                shouldChangeFilter: true
            });
        } else {
            this.setState({
                redirectFilter: selectedTypes.filter(type => type !== event.target.value),
                isTransactionRequested: false,
                shouldChangeFilter: true
            });
        }
    };

    private moveNext = (e: any) => {
        e.preventDefault();
        this.setState({ shouldMoveToNext: true });
    };

    private moveBefore = (e: any) => {
        e.preventDefault();
        this.setState({ shouldMoveToPrevious: true });
    };

    private handleOptionChange = (event: any) => {
        const selected = parseInt(event.target.value, 10);
        this.setState({
            itemsPerPage: selected,
            shouldMoveToFirst: true
        });
    };

    private onTransactions = (response: TransactionsResponse) => {
        const { data, hasNextPage, hasPreviousPage, lastEvaluatedKey, firstEvaluatedKey } = response;
        this.setState({
            transactions: data,
            isTransactionRequested: true,
            hasNextPage,
            hasPreviousPage,
            lastEvaluatedKey,
            firstEvaluatedKey
        });
        /* What is it?
        const {
            location: { search }
        } = this.props;
        const params = new URLSearchParams(search);
        const itemsPerPage = params.get("itemsPerPage") ? parseInt(params.get("itemsPerPage") as string, 10) : 25;
        if (transactions.length < itemsPerPage) {
            this.setState({
                transactionsHasNext: false
            });
        }
        */
    };

    private onError = (error: any) => {
        console.log(error);
    };
}

export default connect((state: RootState) => {
    return {
        serverTimeOffset: state.appReducer.serverTimeOffset
    };
})(Transactions);

function capitalizeFirstLetter(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}
