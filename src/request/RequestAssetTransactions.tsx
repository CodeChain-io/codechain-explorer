import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { TransactionDoc } from "codechain-indexer-types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    itemsPerPage: number;
    page: number;
    assetType: string;
    onTransactions: (s: TransactionDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestAssetTransactions extends React.Component<Props> {
    public componentWillMount() {
        const { dispatch, assetType, onTransactions, onError, page, itemsPerPage } = this.props;
        apiRequest({
            path: `tx?page=${page}&itemsPerPage=${itemsPerPage}&assetType=${assetType}`,
            dispatch,
            showProgressBar: true
        })
            .then((response: TransactionDoc[]) => {
                onTransactions(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}
export default connect()(RequestAssetTransactions);
