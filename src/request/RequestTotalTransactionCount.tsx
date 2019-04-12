import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    address?: string;
    onTransactionTotalCount: (transactionTotalCount: number) => void;
    onError: (e: ApiError) => void;
    selectedTypes?: string[];
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTotalTransactionCount extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onTransactionTotalCount, dispatch, address, selectedTypes } = this.props;
        let path = `tx/count?${address ? `address=${address}` : ""}`;
        if (selectedTypes && selectedTypes.length > 0) {
            path += `&type=${selectedTypes.join(",")}`;
        }
        apiRequest({ path, dispatch, showProgressBar: true })
            .then((response: any) => {
                onTransactionTotalCount(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestTotalTransactionCount);
