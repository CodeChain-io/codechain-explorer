import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ParcelDoc } from "../../db/DocType";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    page: number;
    itemsPerPage: number;
    onParcels: (parcels: ParcelDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestParcelsInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onParcels, dispatch, page, itemsPerPage } = this.props;
        apiRequest({
            path: `parcels?page=${page}&itemsPerPage=${itemsPerPage}`,
            dispatch,
            showProgressBar: true
        })
            .then((response: any) => {
                onParcels(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestParcels = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestParcelsInternal);

export default RequestParcels;
