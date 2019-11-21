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
import { RequestPlatformAddressAccount, RequestTransactions } from "../../request";
import { balanceHistoryReasons, historyReasonTypes } from "../../utils/BalanceHistory";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommaNumberString } from "src/components/util/CommaNumberString/CommaNumberString";
import DataTable from "src/components/util/DataTable/DataTable";
import { apiRequest } from "src/request/ApiRequest";
import { TransactionsResponse } from "src/request/RequestTransactions";
import "./PlatformAddress.scss";

interface BalanceChange {
    change: string;
    blockNumber: number;
    reason: balanceHistoryReasons;
    transactionHash?: string;
    transaction?: {
        type: string;
    };
}

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
    notFound: boolean;
    lastEvaluatedKeyForTransactions?: string;
    noMoreTransaction: boolean;

    balanceChanges?: BalanceChange[];
    lastEvaluatedKeyForBalanceChanges?: string;
    balanceChangesHasNext?: boolean;
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
            noMoreTransaction: false,
            balanceChangesHasNext: true,
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
                balanceChanges: undefined
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
        const { account, notFound } = this.state;
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
                    showProgressBar={false}
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
                {this.renderTransactions()}
            </Container>
        );
    }

    private renderBalanceChanges = () => {
        const { balanceChanges, balanceChangesHasNext, showReasonFilter, selectedReasons } = this.state;

        if (balanceChanges == null) {
            return <FontAwesomeIcon className="spin w-100 mt-3" icon={faSpinner} spin={true} size={"2x"} />;
        }
        return (
            <div className="mt-large">
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-end">
                            <h2>Balance History</h2>
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
                {balanceChangesHasNext && (
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
            case "deposit":
                return "Deposit";
            case "report":
                return "Report double vote";
            case "validator":
                return "Validator reward";
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
            case "deposit":
                return <>Deposit</>;
            case "report":
                return <Link to={`/tx/0x${transactionHash}`}>Report double vote</Link>;
            case "validator":
                return <>Validator Reward</>;
        }
    };

    private renderTransactions = () => {
        const {
            match: {
                params: { address }
            }
        } = this.props;
        const { loadTransaction, lastEvaluatedKeyForTransactions, transactions, noMoreTransaction } = this.state;

        return (
            <>
                {transactions.length > 0 && (
                    <div className="mt-large">
                        <TransactionList
                            transactions={transactions}
                            loadMoreAction={this.loadMoreTransaction}
                            hideMoreButton={noMoreTransaction}
                        />
                    </div>
                )}
                {loadTransaction && (
                    <>
                        <RequestTransactions
                            lastEvaluatedKey={lastEvaluatedKeyForTransactions}
                            itemsPerPage={this.transactionsPerPage}
                            address={address}
                            showProgressBar={false}
                            onTransactions={this.onTransactions}
                            onError={this.onError}
                        />
                        <FontAwesomeIcon className="spin w-100 mt-3" icon={faSpinner} spin={true} size={"2x"} />
                    </>
                )}
            </>
        );
    };

    private loadBalanceHistoryWrapper = () => this.loadBalanceHistory();

    private loadBalanceHistory = (paramReasons?: string[]) => {
        const {
            match: {
                params: { address }
            },
            dispatch
        } = this.props;
        const { lastEvaluatedKeyForBalanceChanges } = this.state;
        const selectedReasons = paramReasons ? paramReasons : this.state.selectedReasons;

        let reasonFilterQuerySuffix = "";
        if (selectedReasons.length > 0) {
            reasonFilterQuerySuffix = `reasonFilter=${selectedReasons.join(",")}`;
        }

        apiRequest({
            path:
                `account/${address}/balance-history?itemsPerPage=${this.balanceChangesPerPage}${
                    lastEvaluatedKeyForBalanceChanges && paramReasons == null
                        ? `&lastEvaluatedKey=${lastEvaluatedKeyForBalanceChanges}`
                        : ""
                }` +
                "&" +
                reasonFilterQuerySuffix,
            dispatch,
            showProgressBar: false
        })
            .then((response: { data: BalanceChange[]; hasNextPage: boolean; lastEvaluatedKey: string }) => {
                const { data: balanceChanges, hasNextPage, lastEvaluatedKey } = response;
                this.setState({
                    balanceChanges: paramReasons
                        ? balanceChanges
                        : [...(this.state.balanceChanges || []), ...balanceChanges],
                    balanceChangesHasNext: hasNextPage,
                    lastEvaluatedKeyForBalanceChanges: lastEvaluatedKey,
                    selectedReasons
                });
            })
            .catch(this.onError);
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

    private onTransactions = (response: TransactionsResponse) => {
        const { data: transactions, hasNextPage, lastEvaluatedKey } = response;
        this.setState({
            transactions: this.state.transactions.concat(transactions),
            noMoreTransaction: !hasNextPage,
            lastEvaluatedKeyForTransactions: lastEvaluatedKey,
            loadTransaction: false
        });
    };
    private loadMoreTransaction = () => {
        this.setState({
            loadTransaction: true
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
