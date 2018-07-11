import * as React from "react";
import * as _ from "lodash";
import { connect, Dispatch } from "react-redux";

import { H256, Transaction } from "codechain-sdk/lib/core/classes";
import { getTransactionFromJSON } from "codechain-sdk/lib/core/transaction/Transaction";

import { apiRequest, ApiError } from "./ApiRequest";
import { RootState } from "../redux/actions";

interface OwnProps {
    assetType: string;
    onTransactionList: (s: Transaction[]) => void;
    onError: (e: ApiError) => void;
}

interface StateProps {
    cached: Transaction[];
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class RequestAssetTransactionListInternal extends React.Component<Props> {
    public componentWillMount() {
        const { cached, dispatch, assetType, onTransactionList, onError } = this.props;
        if (cached) {
            setTimeout(() => onTransactionList(cached));
            return
        }
        apiRequest({ path: `asset-tx/${assetType}` }).then((response: any) => {
            const transactionList: Transaction[] = _.map(response, (r) => getTransactionFromJSON(r));
            const cacheKey = new H256(assetType).value;
            dispatch({
                type: "CACHE_ASSET_TRANSACTION_LIST",
                data: {
                    assetType: cacheKey,
                    transactionList
                }
            });
            onTransactionList(transactionList);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestAssetTransactionList = connect((state: RootState, props: OwnProps) => {
    if (props.assetType.length === 64 || props.assetType.length === 66) {
        return {
            cached: state.transactionListByAssetType[new H256(props.assetType).value]
        };
    }
    return {
        cached: state.transactionListByAssetType[props.assetType]
    };
})(RequestAssetTransactionListInternal);

export default RequestAssetTransactionList;
