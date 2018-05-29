import * as React from "react";
import { connect } from "react-redux";

import { U256 } from "codechain-sdk/lib"

import { RootState } from "../redux/actions";
import { RequestAccount } from "../components/api_request";

interface Props {
    match: any;
}

interface StateProps {
    accountsByAddress: {
        [address: string]: {
            nonce: U256;
            balance: U256;
        }
    }
}

class AccountInternal extends React.Component<Props & StateProps> {
    public render() {
        const { accountsByAddress, match } = this.props;
        const { address } = match.params;
        const account = accountsByAddress[address];

        if (!account) {
            return <div>Loading ... <RequestAccount address={address} /></div>
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
}

const Account = connect((state: RootState) => ({
    accountsByAddress: state.accountsByAddress
} as StateProps))(AccountInternal);

export default Account;
