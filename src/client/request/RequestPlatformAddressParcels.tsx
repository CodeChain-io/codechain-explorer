import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { ParcelDoc } from "../../db/DocType";

interface OwnProps {
    itemsPerPage: number;
    page: number;
    address: string;
    onParcels: (parcels: ParcelDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPlatformAddressParcelsInternal extends React.Component<Props> {
    public componentWillMount() {
        const { address, onParcels, onError, dispatch, page, itemsPerPage } = this.props;
        apiRequest({ path: `addr-platform-parcels/${address}?page=${page}&itemsPerPage=${itemsPerPage}`, dispatch, showProgressBar: true }).then((response: ParcelDoc[]) => {
            onParcels(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestPlatformAddressParcels = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestPlatformAddressParcelsInternal);

export default RequestPlatformAddressParcels;
