import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { U256 } from "codechain-sdk/lib/core/classes";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    address: string;
    onAccount: (account: { nonce: U256, balance: U256 }) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPlatformAddressAccountInternal extends React.Component<Props> {
    public componentWillMount() {
        const { address, onAccount, onError, dispatch } = this.props;
        apiRequest({ path: `addr-platform-account/${address}`, dispatch }).then((response: any) => {
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

const RequestPlatformAddressAccount = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestPlatformAddressAccountInternal);

export default RequestPlatformAddressAccount;
