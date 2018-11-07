import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { PendingParcelDoc } from "codechain-indexer-types/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    actionFilters?: string[];
    signerFilter?: string;
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

class RequestPendingParcels extends React.Component<Props> {
    public componentWillMount() {
        const {
            onPendingParcels,
            onError,
            dispatch,
            actionFilters,
            signerFilter,
            sorting,
            orderBy,
            page,
            itmesPerPage
        } = this.props;
        let path = `parcels/pending?page=${page}&itemsPerPage=${itmesPerPage}&sorting=${sorting}&orderBy=${orderBy}`;
        if (actionFilters) {
            path += `&actionFilters=${actionFilters.join(",")}`;
        }
        if (signerFilter) {
            path += `&signerFilter=${signerFilter}`;
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

export default connect()(RequestPendingParcels);
