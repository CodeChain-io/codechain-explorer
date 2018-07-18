import * as React from "react";

import { apiRequest, ApiError } from "./ApiRequest";
import { ParcelDoc } from "../db/DocType";

interface OwnProps {
    address: string;
    onParcels: (parcels: ParcelDoc[]) => void;
    onError: (e: ApiError) => void;
}

class RequestPlatformAddressParcels extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onParcels, onError } = this.props;
        apiRequest({ path: `addr-platform-parcels/${address}` }).then((response: ParcelDoc[]) => {
            onParcels(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPlatformAddressParcels;
