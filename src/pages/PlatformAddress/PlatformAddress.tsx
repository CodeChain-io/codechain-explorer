import * as _ from "lodash";
import * as QRCode from "qrcode.react";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { match } from "react-router";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { TransactionDoc } from "codechain-indexer-types";
import { U256 } from "codechain-sdk/lib/core/classes";

import { Error } from "../../components/error/Error/Error";
import AccountDetails from "../../components/platformAddress/AccountDetails/AccountDetails";
import TransactionList from "../../components/transaction/TransactionList/TransactionList";
import CopyButton from "../../components/util/CopyButton/CopyButton";
import { ImageLoader } from "../../components/util/ImageLoader/ImageLoader";
import { RequestPlatformAddressAccount, RequestTotalTransactionCount } from "../../request";
import RequestPlatformAddressTransactions from "../../request/RequestPlatformAddressTransactions";
import { balanceHistoryReasons, historyReasonTypes } from "../../utils/BalanceHistory";

import { CommaNumberString } from "src/components/util/CommaNumberString/CommaNumberString";
import DataTable from "src/components/util/DataTable/DataTable";
import { apiRequest } from "src/request/ApiRequest";
import "./PlatformAddress.scss";

interface OwnProps {
    match: match<{ address: string }>;
}

interface DispatchProps {
    dispatch: Dispatch;
}

interface State {
    account?: {
        seq: U256;
        balance: U256;
    };
    transactions: TransactionDoc[];
    loadTransaction: boolean;
    pageForTransaction: number;
    notFound: boolean;
    totalTransactionCount?: number;
    noMoreTransaction: boolean;

    balanceChanges?: {
        change: string;
        blockNumber: number;
        reason: balanceHistoryReasons;
        transactionHash?: string;
        transaction?: {
            type: string;
        };
    }[];
    balanceChangesCount?: number;
    balanceChangesNextPage?: number;
    showReasonFilter: boolean;
    selectedReasons: string[];
}

type Props = OwnProps & DispatchProps;

class PlatformAddress extends React.Component<Props, State> {
    private transactionsPerPage = 6;
    private balanceChangesPerPage = 12;
    constructor(props: Props) {
        super(props);
        this.state = {
            transactions: [],
            notFound: false,
            loadTransaction: true,
            pageForTransaction: 1,
            totalTransactionCount: undefined,
            noMoreTransaction: false,
            showReasonFilter: false,
            selectedReasons: []
        };
    }

    public componentWillReceiveProps(props: Props) {
        const {
            match: {
                params: { address }
            }
        } = this.props;
        const {
            match: {
                params: { address: nextAddress }
            }
        } = props;
        if (nextAddress !== address) {
            this.setState({
                account: undefined,
                transactions: [],
                notFound: false,
                loadTransaction: true,
                noMoreTransaction: false,
                totalTransactionCount: undefined,
                balanceChanges: undefined,
                balanceChangesCount: undefined,
                balanceChangesNextPage: undefined
            });
            setTimeout(() => this.loadBalanceHistory());
        }
    }

    public componentDidMount() {
        this.loadBalanceHistory();
    }

    public render() {
        const {
            match: {
                params: { address }
            }
        } = this.props;
        const {
            account,
            notFound,
            loadTransaction,
            pageForTransaction,
            transactions,
            totalTransactionCount,
            noMoreTransaction
        } = this.state;
        if (notFound) {
            return (
                <div>
                    <Error content={address} title="The address does not exist." />
                </div>
            );
        }
        if (!account) {
            return (
                <RequestPlatformAddressAccount
                    address={address}
                    onAccount={this.onAccount}
                    onError={this.onError}
                    onAccountNotExist={this.onAccountNotExist}
                />
            );
        }
        return (
            <Container className="platform-address animated fadeIn">
                <Row>
                    <Col>
                        <div className="title-container d-flex">
                            <div className="d-inline-block left-container">
                                <ImageLoader size={65} data={address} isAssetImage={false} />
                            </div>
                            <div className="d-inline-block right-container">
                                <h1>Platform Address</h1>
                                <div className="hash-container d-flex">
                                    <div className="d-inline-block hash">
                                        <span>{address}</span>
                                    </div>
                                    <CopyButton className="d-inline-block" copyString={address} />
                                </div>
                            </div>
                            <div className="d-inline-block qrcode-container">
                                <QRCode size={65} value={address} />
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="big-size-qr text-center">
                    <QRCode size={120} value={address} />
                </div>
                <div className="mt-large">
                    <AccountDetails account={account} />
                </div>
                {this.renderBalanceChanges()}
                {totalTransactionCount == null && (
                    <RequestTotalTransactionCount
                        address={address}
                        onTransactionTotalCount={this.onTransactionTotalCount}
                        onError={this.onError}
                    />
                )}
                {totalTransactionCount != null &&
                    loadTransaction && (
                        <RequestPlatformAddressTransactions
                            page={pageForTransaction}
                            itemsPerPage={this.transactionsPerPage}
                            address={address}
                            onTransactions={this.onTransactions}
                            onError={this.onError}
                        />
                    )}
                {totalTransactionCount != null &&
                    transactions.length > 0 && (
                        <div className="mt-large">
                            <TransactionList
                                transactions={transactions}
                                totalCount={totalTransactionCount}
                                loadMoreAction={this.loadMoreTransaction}
                                hideMoreButton={noMoreTransaction}
                            />
                        </div>
                    )}
            </Container>
        );
    }

    private renderBalanceChanges = () => {
        const {
            balanceChanges,
            balanceChangesCount,
            balanceChangesNextPage,
            showReasonFilter,
            selectedReasons
        } = this.state;

        if (balanceChanges == null) {
            return <></>;
        }
        return (
            <div className="mt-large">
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-end">
                            <h2>Balance History</h2>
                            <span>Total {balanceChangesCount} changes</span>
                        </div>
                        {!showReasonFilter && (
                            <div className="show-reason-filter-container">
                                <span className="filter-btn" onClick={this.showReasonFilter}>
                                    Show filter
                                </span>
                            </div>
                        )}
                        {showReasonFilter && (
                            <div className="reason-filter-container">
                                <div className="filter-title">
                                    <span>Filter</span>
                                </div>
                                <Row>
                                    {historyReasonTypes.map(reason => {
                                        const displayName = this.mapReasonToDisplayName(reason);
                                        return (
                                            <Col md={3} key={reason}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={reason}
                                                        checked={_.includes(selectedReasons, reason)}
                                                        value={reason}
                                                        onChange={this.handleFilterChange}
                                                    />
                                                    <label className="form-check-label" htmlFor={`${reason}`}>
                                                        {displayName}
                                                    </label>
                                                </div>
                                            </Col>
                                        );
                                    })}
                                </Row>
                                <div className="hide-reason-filter-container">
                                    <span className="filter-btn" onClick={this.hideReasonFilter}>
                                        Hide filter
                                    </span>
                                </div>
                            </div>
                        )}
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DataTable>
                            <thead>
                                <tr>
                                    <th style={{ width: "10%" }}>Block</th>
                                    <th style={{ width: "20%" }}>Action</th>
                                    <th style={{ width: "35%" }} className="text-right">
                                        Spent
                                    </th>
                                    <th style={{ width: "35%" }} className="text-right">
                                        Received
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {balanceChanges.map(
                                    ({ blockNumber, change, reason, transactionHash, transaction }, i) => (
                                        <tr key={i}>
                                            <td>{blockNumber}</td>
                                            <td>
                                                {this.renderBalanceChangeReason(
                                                    reason,
                                                    transactionHash,
                                                    transaction && transaction.type
                                                )}
                                            </td>
                                            <td className="text-right">
                                                {change.startsWith("-") ? (
                                                    <>
                                                        <CommaNumberString text={change} />
                                                        <span className="ccc">CCC</span>
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </td>
                                            <td className="text-right">
                                                {change.startsWith("-") ? (
                                                    ""
                                                ) : (
                                                    <>
                                                        +<CommaNumberString text={change} />
                                                        <span className="ccc">CCC</span>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </DataTable>
                    </Col>
                </Row>
                {(balanceChangesNextPage! - 1) * this.balanceChangesPerPage < balanceChangesCount! && (
                    <Row>
                        <Col>
                            <div className="mt-small">
                                <button className="btn btn-primary w-100" onClick={this.loadBalanceHistoryWrapper}>
                                    Load changes
                                </button>
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        );
    };

    private mapReasonToDisplayName(reason: string) {
        switch (reason) {
            case "fee":
                return "Transaction fee";
            case "author":
                return "Block author reward";
            case "stake":
                return "Stake reward";
            case "tx":
                return "Transaction";
            case "initial_distribution":
                return "Genesis account";
            default:
                return "";
        }
    }

    private renderBalanceChangeReason = (
        reason: balanceHistoryReasons,
        transactionHash?: string,
        transactionType?: string
    ) => {
        const type = transactionType && transactionType.charAt(0).toUpperCase() + transactionType.slice(1);
        switch (reason) {
            case "fee":
                return <Link to={`/tx/0x${transactionHash}`}>{type} (fee)</Link>;
            case "author":
                return <>Block author reward</>;
            case "stake":
                return <>Stake reward</>;
            case "tx":
                return <Link to={`/tx/0x${transactionHash}`}>{type}</Link>;
            case "initial_distribution":
                return <>Genesis account</>;
        }
    };

    private loadBalanceHistoryWrapper = () => this.loadBalanceHistory();

    private loadBalanceHistory = (paramReasons?: string[]) => {
        const {
            match: {
                params: { address }
            },
            dispatch
        } = this.props;
        const { balanceChangesNextPage } = this.state;
        const selectedReasons = paramReasons ? paramReasons : this.state.selectedReasons;

        let reasonFilterQuerySuffix = "";
        if (selectedReasons.length > 0) {
            reasonFilterQuerySuffix = `reasonFilter=${selectedReasons.join(",")}`;
        }

        if (balanceChangesNextPage == null || paramReasons) {
            Promise.all([
                apiRequest({
                    path:
                        `account/${address}/balance-history?page=1&itemsPerPage=${this.balanceChangesPerPage}` +
                        "&" +
                        reasonFilterQuerySuffix,
                    dispatch,
                    showProgressBar: true
                }),
                apiRequest({
                    path: `account/${address}/balance-history/count` + "?" + reasonFilterQuerySuffix,
                    dispatch,
                    showProgressBar: true
                })
            ])
                .then(([response, count]) => {
                    // FIXME: Remove any
                    this.setState({
                        selectedReasons,
                        balanceChanges: response as any,
                        balanceChangesCount: count as number,
                        balanceChangesNextPage: 2
                    });
                })
                .catch(this.onError);
        } else {
            apiRequest({
                path:
                    `account/${address}/balance-history?page=${balanceChangesNextPage}&itemsPerPage=${
                        this.balanceChangesPerPage
                    }` +
                    "&" +
                    reasonFilterQuerySuffix,
                dispatch,
                showProgressBar: true
            })
                .then(response => {
                    this.setState({
                        balanceChanges: [...this.state.balanceChanges!, ...(response as any)],
                        balanceChangesNextPage: balanceChangesNextPage + 1
                    });
                })
                .catch(this.onError);
        }
    };

    private handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const selectedReasons = [...this.state.selectedReasons, event.target.value];
            this.loadBalanceHistory(selectedReasons);
        } else {
            const selectedReasons = this.state.selectedReasons.filter(reason => reason !== event.target.value);
            this.loadBalanceHistory(selectedReasons);
        }
    };

    private onTransactions = (transactions: TransactionDoc[]) => {
        if (transactions.length < this.transactionsPerPage) {
            this.setState({ noMoreTransaction: true });
        }
        this.setState({
            transactions: this.state.transactions.concat(transactions),
            loadTransaction: false
        });
    };
    private loadMoreTransaction = () => {
        this.setState({
            loadTransaction: true,
            pageForTransaction: this.state.pageForTransaction + 1
        });
    };
    private onTransactionTotalCount = (totalCount: number) => {
        this.setState({
            totalTransactionCount: totalCount,
            noMoreTransaction: this.state.transactions.length >= totalCount
        });
    };
    private onAccountNotExist = () => {
        this.setState({ notFound: true });
    };
    private onAccount = (account: { seq: U256; balance: U256 }) => {
        this.setState({ account });
    };
    private onError = (e: any) => {
        console.error(e);
    };

    private showReasonFilter = () => {
        this.setState({ showReasonFilter: true });
    };

    private hideReasonFilter = () => {
        this.setState({ showReasonFilter: false });
    };
}

export default connect()(PlatformAddress);
