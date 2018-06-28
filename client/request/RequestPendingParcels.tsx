import * as React from "react";
import * as _ from "lodash";

import { SignedParcel } from "codechain-sdk";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    onPendingParcels: (parcels: SignedParcel[]) => void;
    onError: (e: ApiError) => void;
}

class RequestPendingParcels extends React.Component<OwnProps> {
    public componentWillMount() {
        const { onPendingParcels, onError } = this.props;
        apiRequest({ path: `parcel/pending` }).then((response: any) => {
            const parcels = _.map(response, o => SignedParcel.fromJSON(o));
            onPendingParcels(parcels);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPendingParcels;
