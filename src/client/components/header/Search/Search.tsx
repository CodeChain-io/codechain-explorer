import * as React from "react";
import { Form, FormGroup, Input, Button } from 'reactstrap';
import LoadingBar from "react-redux-loading-bar";
import { Redirect } from "react-router";

import './Search.scss';
import { RequestBlock, RequestParcel, RequestTransaction, RequestAssetScheme, RequestPlatformAddressAccount, RequestPendingParcel, RequestPendingTransaction, RequestAssetTransferAddressTransactions } from "../../../request";
import { BlockDoc, ParcelDoc, TransactionDoc, AssetSchemeDoc, PendingParcelDoc, PendingTransactionDoc } from "../../../../db/DocType";
import { U256 } from "codechain-sdk/lib/core/classes";

interface State {
    inputValue: string;
    status: string;
    redirectTo?: string;
    requestCount: number;
}

interface Props {
    className?: string
}

class Search extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            status: "wait",
            inputValue: "",
            requestCount: 0
        };
    }

    public componentWillReceiveProps(props: Props) {
        this.setState({
            status: "wait",
            inputValue: "",
            redirectTo: undefined,
            requestCount: 0
        });
    }

    public render() {
        const { inputValue, status, redirectTo, requestCount } = this.state;
        return <Form inline={true} onSubmit={this.handleSumbit} className={`search-form ${this.props.className}`}>
            <FormGroup className="mb-0">
                <div>
                    <Input className={`search-input ${requestCount === 0 && status === "notFound" && !redirectTo ? "is-invalid" : ""}`} value={inputValue} onChange={this.updateInputValue} type="text" placeholder="Block / Parcel / Tx / Asset / Address" />
                    <LoadingBar scope="searchBar" className="search-loading-bar" />
                </div>
            </FormGroup>
            <Button className="search-summit" type="submit">Search</Button>
            {
                status === "search" ?
                    <div>
                        <RequestBlock progressBarTarget="searchBar" id={inputValue} onBlock={this.onBlock} onBlockNotExist={this.onReqeustNotExist} onError={this.onError} />
                        <RequestParcel progressBarTarget="searchBar" hash={inputValue} onParcel={this.onParcel} onParcelNotExist={this.onReqeustNotExist} onError={this.onError} />
                        <RequestTransaction progressBarTarget="searchBar" hash={inputValue} onTransaction={this.onTransaction} onTransactionNotExist={this.onReqeustNotExist} onError={this.onError} />
                        <RequestAssetScheme progressBarTarget="searchBar" assetType={inputValue} onAssetScheme={this.onAssetScheme} onAssetSchemeNotExist={this.onReqeustNotExist} onError={this.onError} />
                        <RequestPlatformAddressAccount progressBarTarget="searchBar" address={inputValue} onAccount={this.onAccount} onAccountNotExist={this.onReqeustNotExist} onError={this.onError} />
                        <RequestPendingParcel progressBarTarget="searchBar" hash={inputValue} onPendingParcel={this.onPendingParcel} onPendingParcelNotExist={this.onReqeustNotExist} onError={this.onError} />
                        <RequestPendingTransaction progressBarTarget="searchBar" hash={inputValue} onPendingTransaction={this.onPendingTransaction} onPendingTransactionNotExist={this.onReqeustNotExist} onError={this.onError} />
                        <RequestAssetTransferAddressTransactions progressBarTarget="searchBar" address={inputValue} onTransactions={this.onTransactionsForAssetTransferAddress} onError={this.onError} />
                    </div>
                    : null
            }
            {
                requestCount === 0 && redirectTo ? <Redirect push={true} to={redirectTo} /> : null
            }
        </Form>
    }

    private onBlock = (block: BlockDoc) => {
        this.cancelOtherRequest();
        this.setState({ redirectTo: `/block/${block.number}`, requestCount: this.state.requestCount - 1 });
    }

    private onParcel = (parcel: ParcelDoc) => {
        this.cancelOtherRequest();
        this.setState({ redirectTo: `/parcel/0x${parcel.hash}`, requestCount: this.state.requestCount - 1 });
    }

    private onTransaction = (transaction: TransactionDoc) => {
        this.cancelOtherRequest();
        this.setState({ redirectTo: `/tx/0x${transaction.data.hash}`, requestCount: this.state.requestCount - 1 });
    }

    private onAssetScheme = (asset: AssetSchemeDoc, assetType: string) => {
        this.cancelOtherRequest();
        this.setState({ redirectTo: `/asset/${assetType}`, requestCount: this.state.requestCount - 1 });
    }

    private onPendingParcel = (pendingParcel: PendingParcelDoc) => {
        this.cancelOtherRequest();
        this.setState({ redirectTo: `/parcel/0x${pendingParcel.parcel.hash}`, requestCount: this.state.requestCount - 1 });
    }

    private onTransactionsForAssetTransferAddress = (transactions: TransactionDoc[], address: string) => {
        if (transactions.length > 0) {
            this.cancelOtherRequest();
            this.setState({ redirectTo: `/addr-asset/${address}`, requestCount: this.state.requestCount - 1 });
        } else {
            this.handleNotFoundOrError();
        }
    }

    private onAccount = (account: { nonce: U256, balance: U256 }, address: string) => {
        this.cancelOtherRequest();
        this.setState({ redirectTo: `/addr-platform/${address}`, requestCount: this.state.requestCount - 1 });
    }

    private onPendingTransaction = (pendingTransaction: PendingTransactionDoc) => {
        this.cancelOtherRequest();
        this.setState({ redirectTo: `/tx/0x${pendingTransaction.transaction.data.hash}`, requestCount: this.state.requestCount - 1 });
    }

    private cancelOtherRequest = () => {
        // TODO
    }

    private onReqeustNotExist = () => {
        this.handleNotFoundOrError();
    }

    private onError = (e: any) => {
        this.handleNotFoundOrError();
    }

    private handleNotFoundOrError = () => {
        const requestCount = this.state.requestCount - 1;
        if (requestCount === 0) {
            this.setState({ requestCount, status: "notFound" });
        } else {
            this.setState({ requestCount });
        }
    }

    private updateInputValue = (e: any) => {
        this.setState({
            inputValue: e.target.value
        });
    }

    private handleSumbit = (e: any) => {
        e.preventDefault();
        if (this.state.status === "search") {
            return;
        }
        const inputValue = this.state.inputValue.trim();
        this.setState({ status: "search", requestCount: 8, inputValue });
    }
}

export default Search;
