import * as React from "react";
import * as _ from "lodash";

import { SignedParcel } from "codechain-sdk/lib/core/classes";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    address: string;
    onParcels: (parcels: SignedParcel[]) => void;
    onError: (e: ApiError) => void;
}

class RequestPlatformAddressParcels extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onParcels, onError } = this.props;
        apiRequest({ path: `addr-platform-parcels/${address}` }).then((response) => {
            onParcels(_.map(response, res => SignedParcel.fromJSON(res)));
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPlatformAddressParcels;
