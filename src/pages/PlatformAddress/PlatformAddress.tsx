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
        reason: "fee" | "author" | "stake" | "tx" | "initial_distribution";
        transactionHash?: string;
        transaction?: {
            type: string;
        };
    }[];
    balanceChangesCount?: number;
    balanceChangesNextPage?: number;
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
            noMoreTransaction: false
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
        const { balanceChanges, balanceChangesCount, balanceChangesNextPage } = this.state;

        if (balanceChanges == null) {
            return <></>;
        }
        return (
            <div className="mt-large">
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-end">
                            <h2>Balance Log</h2>
                            <span>Total {balanceChangesCount} changes</span>
                        </div>
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <DataTable>
                            <thead>
                                <tr>
                                    <th style={{ width: "10%" }}>Block</th>
                                    <th style={{ width: "20%" }}>Reason</th>
                                    <th style={{ width: "35%" }} className="text-right">
                                        Spend
                                    </th>
                                    <th style={{ width: "35%" }} className="text-right">
                                        Receive
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
                                                {change.startsWith("-") ? <CommaNumberString text={change} /> : ""}
                                            </td>
                                            <td className="text-right">
                                                {change.startsWith("-") ? (
                                                    ""
                                                ) : (
                                                    <>
                                                        +<CommaNumberString text={change} />
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
                                <button className="btn btn-primary w-100" onClick={this.loadBalanceHistory}>
                                    Load changes
                                </button>
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        );
    };

    private renderBalanceChangeReason = (
        reason: "fee" | "author" | "stake" | "tx" | "initial_distribution",
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

    private loadBalanceHistory = () => {
        const {
            match: {
                params: { address }
            },
            dispatch
        } = this.props;
        const { balanceChangesNextPage } = this.state;
        if (balanceChangesNextPage == null) {
            Promise.all([
                apiRequest({
                    path: `account/${address}/balance-history?page=1&itemsPerPage=${this.balanceChangesPerPage}`,
                    dispatch,
                    showProgressBar: true
                }),
                apiRequest({ path: `account/${address}/balance-history/count`, dispatch, showProgressBar: true })
            ])
                .then(([response, count]) => {
                    // FIXME: Remove any
                    this.setState({
                        balanceChanges: response as any,
                        balanceChangesCount: count as number,
                        balanceChangesNextPage: 2
                    });
                })
                .catch(this.onError);
        } else {
            apiRequest({
                path: `account/${address}/balance-history?page=${balanceChangesNextPage}&itemsPerPage=${
                    this.balanceChangesPerPage
                }`,
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
}

export default connect()(PlatformAddress);
