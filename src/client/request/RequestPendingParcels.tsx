import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { PendingParcelDoc } from "../../db/DocType";

interface OwnProps {
    actionFilters: string[];
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
        const { onPendingParcels, onError, dispatch, actionFilters, signerFiter, sorting, orderBy, page, itmesPerPage } = this.props;
        if (actionFilters.length === 0) {
            onPendingParcels([]);
        }
        let path = `parcels/pending?page=${page}&itemsPerPage=${itmesPerPage}&actionFilters=${actionFilters.join(",")}&sorting=${sorting}&orderBy=${orderBy}`
        if (signerFiter) {
            path += `&signerFiter=${signerFiter}`;
        }
        apiRequest({ path, dispatch, showProgressBar: true }).then((response: any) => {
            onPendingParcels(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestPendingParcels = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestPendingParcelsInternal);

export default RequestPendingParcels;
