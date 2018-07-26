import * as React from "react";
import { Form, FormGroup, Input, Button } from 'reactstrap';
import LoadingBar from "react-redux-loading-bar";
import { Redirect } from "react-router";

import './Search.scss';
import { RequestBlock, RequestParcel, RequestTransaction, RequestAssetScheme, RequestPlatformAddressAccount } from "../../../request";
import { BlockDoc, ParcelDoc, TransactionDoc, AssetSchemeDoc } from "../../../../db/DocType";
import { U256 } from "codechain-sdk/lib/core/classes";

interface State {
    inputValue: string;
    status: string;
    redirectTo?: string;
}

interface Props {
    className?: string
}

class Search extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            status: "wait",
            inputValue: ""
        };
    }

    public componentWillReceiveProps(props: Props) {
        this.setState({
            status: "wait",
            inputValue: "",
            redirectTo: undefined
        });
    }

    public render() {
        const { inputValue, status, redirectTo } = this.state;
        return <Form inline={true} onSubmit={this.handleSumbit} className={`search-form ${this.props.className}`}>
            <FormGroup className="mb-0">
                <div>
                    <Input className="search-input" value={inputValue} onChange={this.updateInputValue} type="text" placeholder="Block / Parcel / Tx / Asset / Address" />
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
                    </div>
                    : null
            }
            {
                redirectTo ?
                    <Redirect push={true} to={redirectTo} />
                    : null
            }
        </Form>
    }

    private onBlock = (block: BlockDoc) => {
        this.cancelOtherRequest();
        this.setState({ redirectTo: `/block/${block.number}` });
    }

    private onParcel = (parcel: ParcelDoc) => {
        this.cancelOtherRequest();
        this.setState({ redirectTo: `/parcel/0x${parcel.hash}` });
    }

    private onTransaction = (transaction: TransactionDoc) => {
        this.cancelOtherRequest();
        this.setState({ redirectTo: `/tx/0x${transaction.data.hash}` });
    }

    private onAssetScheme = (asset: AssetSchemeDoc, assetType: string) => {
        this.cancelOtherRequest();
        this.setState({ redirectTo: `/asset/${assetType}` });
    }

    private onAccount = (account: { nonce: U256, balance: U256 }, address: string) => {
        this.cancelOtherRequest();
        this.setState({ redirectTo: `/addr-platform/${address}` });
    }

    private cancelOtherRequest = () => {
        // TODO
    }

    private onReqeustNotExist = () => {
        // TODO
    }

    private onError = (e: any) => {
        console.log(e);
    }

    private updateInputValue = (e: any) => {
        this.setState({
            inputValue: e.target.value
        });
    }

    private handleSumbit = (e: any) => {
        e.preventDefault();
        this.setState({ status: "search" });
    }
}

export default Search;
