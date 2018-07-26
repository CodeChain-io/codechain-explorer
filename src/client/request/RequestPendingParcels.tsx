import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { PendingParcelDoc } from "../../db/DocType";

interface OwnProps {
    onPendingParcels: (parcels: PendingParcelDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPendingParcelsInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onPendingParcels, onError, dispatch } = this.props;
        apiRequest({ path: `parcels/pending`, dispatch }).then((response: any) => {
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
