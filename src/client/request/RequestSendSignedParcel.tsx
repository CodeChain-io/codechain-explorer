import * as React from "react";

import { H256, SignedParcel } from "codechain-sdk/lib/core/classes";

import { ApiError } from "./ApiRequest";

interface OwnProps {
    parcel: SignedParcel;
    onSuccess: (hash: H256) => void;
    onError: (e: ApiError) => void;
}

export class RequestSendSignedParcel extends React.Component<OwnProps> {
    public componentWillMount() {
        // TODO
    }

    public render() {
        return null;
    }
}
