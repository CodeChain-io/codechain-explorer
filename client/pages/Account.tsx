import * as React from "react";

import { U256 } from "codechain-sdk/lib"

import { RequestAccount } from "../components/api_request";

interface Props {
    match: any;
}

interface States {
    account?: {
        nonce: U256;
        balance: U256;
    }
}

class Account extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }
    public render() {
        const { match } = this.props;
        const { address } = match.params;
        const { account } = this.state;

        if (!account) {
            return <div>Loading ... <RequestAccount address={address} onAccount={this.onAccount} onError={this.onError}/></div>
        }
        return (
            <div>
                <h4>{address}</h4>
                <div>Balance: {account.balance.value.toString()}</div>
                <div>Nonce: {account.nonce.value.toString()}</div>
                <hr />
                <div>Transaction List</div>
                <hr />
                {/* FIXME: not implemented */}
            </div>
        )
    }

    private onAccount = (account: { nonce: U256, balance: U256 }) => {
        this.setState({ account });
    }
    private onError = (e: any) => { console.error(e); }
}

export default Account;
