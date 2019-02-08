import { TransactionDoc } from "codechain-indexer-types";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    itemsPerPage: number;
    page: number;
    address: string;
    onTransactions: (txs: TransactionDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPlatformAddressTransactions extends React.Component<Props> {
    public componentWillMount() {
        const { address, onTransactions, onError, dispatch, page, itemsPerPage } = this.props;
        apiRequest({
            path: `tx?page=${page}&itemsPerPage=${itemsPerPage}&address=${address}`,
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

export default connect()(RequestPlatformAddressTransactions);
