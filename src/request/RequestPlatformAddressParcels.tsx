import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ParcelDoc } from "codechain-indexer-types/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

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

class RequestPlatformAddressParcels extends React.Component<Props> {
    public componentWillMount() {
        const { address, onParcels, onError, dispatch, page, itemsPerPage } = this.props;
        apiRequest({
            path: `addr-platform-parcels/${address}?page=${page}&itemsPerPage=${itemsPerPage}`,
            dispatch,
            showProgressBar: true
        })
            .then((response: ParcelDoc[]) => {
                onParcels(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestPlatformAddressParcels);
