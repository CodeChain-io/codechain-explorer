import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { ParcelDoc } from "../../db/DocType";

interface OwnProps {
    onParcels: (parcels: ParcelDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestParcelsInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onParcels, dispatch } = this.props;
        apiRequest({ path: `parcels`, dispatch }).then((response: any) => {
            onParcels(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestParcels = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestParcelsInternal);

export default RequestParcels;
