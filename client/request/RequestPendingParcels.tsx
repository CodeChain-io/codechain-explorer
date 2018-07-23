import * as React from "react";

import { apiRequest, ApiError } from "./ApiRequest";
import { PendingParcelDoc } from "db/DocType";

interface OwnProps {
    onPendingParcels: (parcels: PendingParcelDoc[]) => void;
    onError: (e: ApiError) => void;
}

class RequestPendingParcels extends React.Component<OwnProps> {
    public componentWillMount() {
        const { onPendingParcels, onError } = this.props;
        apiRequest({ path: `parcel/pending` }).then((response: any) => {
            onPendingParcels(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPendingParcels;
