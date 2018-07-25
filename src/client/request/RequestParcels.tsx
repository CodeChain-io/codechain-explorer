import * as React from "react";

import { apiRequest, ApiError } from "./ApiRequest";
import { ParcelDoc } from "../../db/DocType";

interface OwnProps {
    onParcels: (parcels: ParcelDoc[]) => void;
    onError: (e: ApiError) => void;
}

class RequestParcels extends React.Component<OwnProps> {
    public componentWillMount() {
        const { onError, onParcels } = this.props;
        apiRequest({ path: `parcels` }).then((response: any) => {
            onParcels(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestParcels;
