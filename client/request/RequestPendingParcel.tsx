import * as React from "react";

import { apiRequest, ApiError } from "./ApiRequest";
import { PendingParcelDoc } from "db/DocType";

interface OwnProps {
    onPendingParcel: (parcel: PendingParcelDoc) => void;
    onError: (e: ApiError) => void;
    onPendingParcelNotExist: () => void;
    hash: string;
}

class RequestPendingParcel extends React.Component<OwnProps> {
    public componentWillMount() {
        const { onPendingParcel, onError, onPendingParcelNotExist, hash } = this.props;
        apiRequest({ path: `parcel/pending/${hash}` }).then((response: any) => {
            if (!response) {
                onPendingParcelNotExist();
            }
            onPendingParcel(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestPendingParcel;
