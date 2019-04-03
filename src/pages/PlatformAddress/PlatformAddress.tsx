import * as QRCode from "qrcode.react";
import * as React from "react";
import { match } from "react-router";
import { Col, Container, Row } from "reactstrap";
import { Error } from "../../components/error/Error/Error";

import { BlockDoc, TransactionDoc } from "codechain-indexer-types";
import { U256 } from "codechain-sdk/lib/core/classes";
import BlockList from "../../components/block/BlockList/BlockList";
import AccountDetails from "../../components/platformAddress/AccountDetails/AccountDetails";
import {
    RequestPlatformAddressAccount,
    RequestTotalPlatformBlockCount,
    RequestTotalTransactionCount
} from "../../request";
import RequestPlatformAddressBlocks from "../../request/RequestPlatformAddressBlocks";

import TransactionList from "../../components/transaction/TransactionList/TransactionList";
import CopyButton from "../../components/util/CopyButton/CopyButton";
import { ImageLoader } from "../../components/util/ImageLoader/ImageLoader";
import RequestPlatformAddressTransactions from "../../request/RequestPlatformAddressTransactions";
import "./PlatformAddress.scss";

interface Props {
    match: match<{ address: string }>;
}

interface State {
    account?: {
        seq: U256;
        balance: U256;
    };
    blocks: BlockDoc[];
    transactions: TransactionDoc[];
    loadTransaction: boolean;
    loadBlock: boolean;
    pageForBlock: number;
    pageForTransaction: number;
    noMoreBlock: boolean;
    notFound: boolean;
    totalBlockCount?: number;
    totalTransactionCount?: number;
    noMoreTransaction: boolean;
}

class Address extends React.Component<Props, State> {
    private blockItemsPerPage = 6;
    private transactionsPerPage = 6;
    constructor(props: Props) {
        super(props);
        this.state = {
            blocks: [],
            transactions: [],
            notFound: false,
            loadBlock: true,
            loadTransaction: true,
            pageForBlock: 1,
            pageForTransaction: 1,
            noMoreBlock: false,
            totalBlockCount: undefined,
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
                blocks: [],
                transactions: [],
                notFound: false,
                loadBlock: true,
                loadTransaction: true,
                noMoreBlock: false,
                noMoreTransaction: false,
                totalBlockCount: undefined,
                totalTransactionCount: undefined
            });
        }
    }

    public render() {
        const {
            match: {
                params: { address }
            }
        } = this.props;
        const {
            account,
            blocks,
            notFound,
            loadBlock,
            loadTransaction,
            pageForBlock,
            noMoreBlock,
            totalBlockCount,
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
                {totalBlockCount == null && (
                    <RequestTotalPlatformBlockCount
                        address={address}
                        onTotalCount={this.onTotalBlockCount}
                        onError={this.onError}
                    />
                )}
                {totalTransactionCount == null && (
                    <RequestTotalTransactionCount
                        address={address}
                        onTransactionTotalCount={this.onTransactionTotalCount}
                        onError={this.onError}
                    />
                )}
                {totalBlockCount != null && loadBlock ? (
                    <RequestPlatformAddressBlocks
                        page={pageForBlock}
                        itemsPerPage={this.blockItemsPerPage}
                        address={address}
                        onBlocks={this.onBlocks}
                        onError={this.onError}
                    />
                ) : null}
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
                {totalBlockCount != null && blocks.length > 0 ? (
                    <div className="mt-large">
                        <BlockList
                            blocks={blocks}
                            totalCount={totalBlockCount}
                            loadMoreAction={this.loadMoreBlock}
                            hideMoreButton={noMoreBlock}
                        />
                    </div>
                ) : null}
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
    private onBlocks = (blocks: BlockDoc[]) => {
        if (blocks.length < this.blockItemsPerPage) {
            this.setState({ noMoreBlock: true });
        }
        this.setState({
            blocks: this.state.blocks.concat(blocks),
            loadBlock: false
        });
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
    private loadMoreBlock = () => {
        this.setState({
            loadBlock: true,
            pageForBlock: this.state.pageForBlock + 1
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
    private onTotalBlockCount = (totalCount: number) => {
        this.setState({
            totalBlockCount: totalCount,
            noMoreBlock: this.state.blocks.length >= totalCount
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

export default Address;
