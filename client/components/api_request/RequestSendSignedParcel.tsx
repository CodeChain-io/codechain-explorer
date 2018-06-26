import * as React from "react";

import { H256, SignedParcel } from "codechain-sdk";

import { apiRequest, ApiError } from "./ApiRequest";

interface OwnProps {
    parcel: SignedParcel,
    onSuccess: (hash: H256) => void;
    onError: (e: ApiError) => void;
}

export class RequestSendSignedParcel extends React.Component<OwnProps> {
    public componentWillMount() {
        const { parcel, onSuccess, onError } = this.props;
        apiRequest({
            path: `parcel/signed`,
            body: parcel.toJSON()
        }).then((response: string) => {
            const hash = new H256(response);
            onSuccess(hash);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}
