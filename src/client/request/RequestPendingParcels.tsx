import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { PendingParcelDoc } from "codechain-es/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    actionFilters?: string[];
    signerFiter?: string;
    sorting: string;
    orderBy: string;
    page: number;
    itmesPerPage: number;
    onPendingParcels: (parcels: PendingParcelDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPendingParcelsInternal extends React.Component<Props> {
    public componentWillMount() {
        const {
            onPendingParcels,
            onError,
            dispatch,
            actionFilters,
            signerFiter,
            sorting,
            orderBy,
            page,
            itmesPerPage
        } = this.props;
        let path = `parcels/pending?page=${page}&itemsPerPage=${itmesPerPage}&sorting=${sorting}&orderBy=${orderBy}`;
        if (actionFilters) {
            path += `&actionFilters=${actionFilters.join(",")}`;
        }
        if (signerFiter) {
            path += `&signerFiter=${signerFiter}`;
        }
        apiRequest({ path, dispatch, showProgressBar: true })
            .then((response: any) => {
                onPendingParcels(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestPendingParcels = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestPendingParcelsInternal);

export default RequestPendingParcels;
