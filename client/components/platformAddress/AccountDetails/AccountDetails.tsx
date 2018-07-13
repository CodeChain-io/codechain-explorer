import * as React from "react";
import { U256 } from "codechain-sdk/lib/core/classes";

import "./AccountDetails.scss";

interface OwnProps {
    account: {
        nonce: U256,
        balance: U256,
    },
}

const AccountDetails = (prop: OwnProps) => {
    const { account } = prop;
    return <div className="account-detail-container mb-3">
        <table className="account-detail-table">
            <tbody>
                <tr>
                    <td>Balance</td>
                    <td>{account.balance.value.toString()}</td>
                </tr>
                <tr>
                    <td>Nonce</td>
                    <td>{account.nonce.value.toString()}</td>
                </tr>
            </tbody>
        </table>
    </div>
};

export default AccountDetails;
