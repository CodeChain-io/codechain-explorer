import { TransactionDoc } from "codechain-indexer-types";
import * as _ from "lodash";
import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    id: number | string;
    page: number;
    itemsPerPage: number;
    onTransactions: (txs: TransactionDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface StateProps {
    cached?: { data: TransactionDoc[]; updatedAt: number };
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;
class RequestBlockTransactions extends React.Component<Props> {
    public componentWillMount() {
        const { id, page, itemsPerPage, dispatch } = this.props;
        const { onError, onTransactions } = this.props;
        apiRequest({
            path: `block/${id}/tx?page=${page}&itemsPerPage=${itemsPerPage}`,
            dispatch,
            showProgressBar: true
        })
            .then(onTransactions)
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestBlockTransactions);
