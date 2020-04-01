import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { U256 } from "codechain-sdk/lib/core/classes";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    address: string;
    onAccount: (account: { seq: U256; balance: U256 }, address: string) => void;
    onError: (e: ApiError) => void;
    onAccountNotExist: () => void;
    progressBarTarget?: string;
    showProgressBar: boolean;
}

type Props = OwnProps & DispatchProp;

class RequestPlatformAddressAccount extends React.Component<Props> {
    public componentWillMount() {
        const {
            address,
            onAccount,
            onError,
            dispatch,
            progressBarTarget,
            showProgressBar,
            onAccountNotExist
        } = this.props;
        apiRequest({
            path: `account/${address}`,
            dispatch,
            progressBarTarget,
            showProgressBar
        })
            .then((response: any) => {
                if (response === null) {
                    return onAccountNotExist();
                }
                const { seq, balance } = response;
                onAccount(
                    {
                        seq: new U256(seq),
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
export default connect()(RequestPlatformAddressAccount);
