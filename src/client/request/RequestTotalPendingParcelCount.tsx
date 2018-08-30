import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    actionFilters: string[];
    signerFiter?: string;
    onPendingParcelTotalCount: (pendingParcelTotalCount: number) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTotalPendingParcelCountInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onPendingParcelTotalCount, dispatch, actionFilters, signerFiter } = this.props;

        if (actionFilters.length === 0) {
            onPendingParcelTotalCount(0);
        }
        let path = `parcels/pending/totalCount?actionFilters=${actionFilters.join(",")}`;
        if (signerFiter) {
            path += `&signerFiter=${signerFiter}`;
        }
        apiRequest({ path, dispatch, showProgressBar: true })
            .then((response: any) => {
                onPendingParcelTotalCount(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestTotalPendingParcelCount = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestTotalPendingParcelCountInternal);

export default RequestTotalPendingParcelCount;
