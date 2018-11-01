import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { PendingTransactionDoc } from "codechain-indexer-types/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    onPendingTransactions: (pendingTransactions: PendingTransactionDoc[]) => void;
    onError: (e: ApiError) => void;
    address: string;
    progressBarTarget?: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPendingTransactionsByAddressInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onPendingTransactions, onError, address, dispatch, progressBarTarget } = this.props;
        apiRequest({
            path: `addr-asset-txs/pending/${address}`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: any) => {
                onPendingTransactions(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestPendingTransactionsByAddress = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestPendingTransactionsByAddressInternal);

export default RequestPendingTransactionsByAddress;
