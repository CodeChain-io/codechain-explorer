import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { H256 } from "codechain-sdk/lib/core/classes";

import { apiRequest, ApiError } from "./ApiRequest";
import { RootState } from "../redux/actions";
import { TransactionDoc, Type } from "../../db/DocType";

interface OwnProps {
    assetType: string;
    onTransactions: (s: TransactionDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface StateProps {
    cached: TransactionDoc[];
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class RequestAssetTransactionsInternal extends React.Component<Props> {
    public componentWillMount() {
        const { cached, dispatch, assetType, onTransactions, onError } = this.props;
        if (cached) {
            setTimeout(() => onTransactions(cached));
            return
        }
        apiRequest({ path: `asset-txs/${assetType}`, dispatch, showProgressBar: true }).then((response: TransactionDoc[]) => {
            const transactions = response;
            const cacheKey = new H256(assetType).value;
            dispatch({
                type: "CACHE_ASSET_TRANSACTIONS",
                data: {
                    assetType: cacheKey,
                    transactions
                }
            });
            onTransactions(transactions);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestAssetTransactions = connect((state: RootState, props: OwnProps) => {
    if (Type.isH256String(props.assetType)) {
        return {
            cached: state.appReducer.transactionsByAssetType[new H256(props.assetType).value]
        };
    }
    return {
        cached: state.appReducer.transactionsByAssetType[props.assetType]
    };
})(RequestAssetTransactionsInternal);

export default RequestAssetTransactions;
