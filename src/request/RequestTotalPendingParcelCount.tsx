import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    actionFilters?: string[];
    signerFilter?: string;
    onPendingParcelTotalCount: (pendingParcelTotalCount: number) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTotalPendingParcelCount extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onPendingParcelTotalCount, dispatch, actionFilters, signerFilter } = this.props;

        let path = "parcels/pending/totalCount";
        if (actionFilters) {
            path += `?actionFilters=${actionFilters.join(",")}`;
        }
        if (signerFilter) {
            path += `&signerFilter=${signerFilter}`;
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

export default connect()(RequestTotalPendingParcelCount);
