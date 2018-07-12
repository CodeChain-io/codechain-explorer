import * as React from "react";

import { Parcel } from "codechain-sdk/lib/core/classes";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    address: string;
    onParcels: (parcels: Parcel[]) => void;
    onError: (e: ApiError) => void;
}

class RequestPlatformAddressParcels extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onParcels, onError } = this.props;
        apiRequest({ path: `addr-platform-parcels/${address}` }).then(() => {
            onParcels([]);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPlatformAddressParcels;
