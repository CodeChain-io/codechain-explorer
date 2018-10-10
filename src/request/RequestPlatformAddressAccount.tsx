import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { U256 } from "codechain-sdk/lib/core/classes";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    address: string;
    onAccount: (account: { nonce: U256; balance: U256 }, address: string) => void;
    onError: (e: ApiError) => void;
    onAccountNotExist: () => void;
    progressBarTarget?: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPlatformAddressAccountInternal extends React.Component<Props> {
    public componentWillMount() {
        const { address, onAccount, onError, dispatch, progressBarTarget, onAccountNotExist } = this.props;
        apiRequest({
            path: `addr-platform-account/${address}`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: any) => {
                if (response === null) {
                    return onAccountNotExist();
                }
                const { nonce, balance } = response;
                onAccount(
                    {
                        nonce: new U256(nonce),
                        balance: new U256(balance)
                    },
                    address
                );
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestPlatformAddressAccount = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestPlatformAddressAccountInternal);

export default RequestPlatformAddressAccount;
