import * as React from "react";

import { U256 } from "codechain-sdk/lib/core/classes";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    address: string;
    onAccount: (account: { nonce: U256, balance: U256 }) => void;
    onError: (e: ApiError) => void;
}

class RequestPlatformAddressAccount extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onAccount, onError } = this.props;
        apiRequest({ path: `addr-platform-account/${address}` }).then((response: any) => {
            const { nonce, balance } = response;
            onAccount({
                nonce: new U256(nonce),
                balance: new U256(balance),
            });
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPlatformAddressAccount;
