import * as React from "react";
import { match } from "react-router";
import { Grid } from 'react-bootstrap';

import { U256 } from "codechain-sdk/lib"

import { RequestAccount } from "../request";

interface Props {
    match: match<{ address: string }>;
}

interface State {
    account?: {
        nonce: U256;
        balance: U256;
    }
}

class Account extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { address } } } = this.props;
        const { match: { params: { address: nextAddress } } } = props;
        if (nextAddress !== address) {
            this.setState({ account: undefined });
        }
    }

    public render() {
        const { match: { params: { address } } } = this.props;
        const { account } = this.state;

        if (!account) {
            return <div><Grid>Loading ... <RequestAccount address={address} onAccount={this.onAccount} onError={this.onError} /></Grid></div>
        }
        return (
            <div>
                <Grid>
                    <h4>{address}</h4>
                    <div>Balance: {account.balance.value.toString()}</div>
                    <div>Nonce: {account.nonce.value.toString()}</div>
                    <hr />
                    <div>Transaction List</div>
                    <hr />
                    {/* FIXME: not implemented */}
                </Grid>
            </div>
        )
    }

    private onAccount = (account: { nonce: U256, balance: U256 }) => {
        this.setState({ account });
    }
    private onError = (e: any) => { console.error(e); }
}

export default Account;
