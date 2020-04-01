import { TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

export interface TransactionsResponse {
    data: TransactionDoc[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    firstEvaluatedKey: string;
    lastEvaluatedKey: string;
}

interface OwnProps {
    firstEvaluatedKey?: string;
    lastEvaluatedKey?: string;
    itemsPerPage: number;
    showProgressBar: boolean;
    onTransactions: (transactions: TransactionsResponse) => void;
    onError: (e: ApiError) => void;
    selectedTypes?: string[];
    progressBarTarget?: string;
    address?: string;
    assetType?: string;
}

type Props = OwnProps & DispatchProp;

class RequestTransactions extends React.Component<Props> {
    public componentWillMount() {
        const {
            onError,
            onTransactions,
            dispatch,
            lastEvaluatedKey,
            firstEvaluatedKey,
            itemsPerPage,
            showProgressBar,
            selectedTypes,
            progressBarTarget,
            address,
            assetType
        } = this.props;
        let path = `tx?itemsPerPage=${itemsPerPage}${lastEvaluatedKey ? `&lastEvaluatedKey=${lastEvaluatedKey}` : ""}${
            firstEvaluatedKey ? `&firstEvaluatedKey=${firstEvaluatedKey}` : ""
        }`;
        if (selectedTypes && selectedTypes.length > 0) {
            path += `&type=${selectedTypes.join(",")}`;
        }
        if (address) {
            path += `&address=${address}`;
        }
        if (assetType) {
            path += `&assetType=${assetType}`;
        }
        apiRequest({
            path,
            dispatch,
            showProgressBar,
            progressBarTarget
        })
            .then((response: any) => {
                onTransactions(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestTransactions);
