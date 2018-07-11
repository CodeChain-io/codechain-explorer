import * as React from "react";
import * as _ from "lodash";
import { connect, Dispatch } from "react-redux";

import { H256, Transaction } from "codechain-sdk/lib/core/classes";
import { getTransactionFromJSON } from "codechain-sdk/lib/core/transaction/Transaction";

import { apiRequest, ApiError } from "./ApiRequest";
import { RootState } from "../redux/actions";

interface OwnProps {
    assetType: string;
    onTransactions: (s: Transaction[]) => void;
    onError: (e: ApiError) => void;
}

interface StateProps {
    cached: Transaction[];
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
        apiRequest({ path: `asset-tx/${assetType}` }).then((response: any) => {
            const transactions: Transaction[] = _.map(response, (r) => getTransactionFromJSON(r));
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
    if (props.assetType.length === 64 || props.assetType.length === 66) {
        return {
            cached: state.transactionsByAssetType[new H256(props.assetType).value]
        };
    }
    return {
        cached: state.transactionsByAssetType[props.assetType]
    };
})(RequestAssetTransactionsInternal);

export default RequestAssetTransactions;
