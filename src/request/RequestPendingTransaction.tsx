import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { PendingTransactionDoc } from "codechain-indexer-types/lib/types";
import { Type } from "codechain-indexer-types/lib/utils";
import { H256 } from "codechain-sdk/lib/core/classes";
import { RootState } from "../redux/actions";
import { getCurrentTimestamp } from "../utils/Time";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    onPendingTransaction: (pendingTransactionDoc: PendingTransactionDoc) => void;
    onError: (e: ApiError) => void;
    onPendingTransactionNotExist: () => void;
    progressBarTarget?: string;
    hash: string;
}

interface StateProps {
    cached?: { data: PendingTransactionDoc; updatedAt: number };
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps & StateProps;

class RequestPendingTransaction extends React.Component<Props> {
    public componentWillMount() {
        const {
            onPendingTransaction,
            onError,
            hash,
            onPendingTransactionNotExist,
            dispatch,
            progressBarTarget,
            cached
        } = this.props;
        if (cached && getCurrentTimestamp() - cached.updatedAt < 10) {
            setTimeout(() => onPendingTransaction(cached.data));
            return;
        }
        apiRequest({
            path: `tx/pending/${hash}`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: any) => {
                if (response === null) {
                    return onPendingTransactionNotExist();
                }
                onPendingTransaction(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect((state: RootState, props: OwnProps) => {
    let cacheKey = props.hash;
    if (Type.isH256String(cacheKey)) {
        cacheKey = new H256(cacheKey).value;
    }
    const cachedPendingTransaction = state.appReducer.pendingTransactionByHash[cacheKey];
    return {
        cached: {
            data: cachedPendingTransaction.data,
            updatedAt: cachedPendingTransaction.updatedAt
        }
    };
})(RequestPendingTransaction);
