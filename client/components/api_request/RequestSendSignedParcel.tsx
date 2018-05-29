import * as React from "react";

import { H256, SignedParcel } from "codechain-sdk/lib/primitives";

import { RootState } from "../../redux/actions";
import ApiDispatcher from "./ApiDispatcher";

interface Props {
    parcel: SignedParcel,
    onStart?: () => void;
    onFinish?: (hash: H256) => void;
    onError?: (e: any) => void;
}

const reducer = (state: RootState, req: Props, res: any) => ({});

export const RequestSendSignedParcel = (props: Props) => {
    const { parcel, onStart, onFinish, onError } = props;
    return <ApiDispatcher
        api={`parcel/signed`}
        reducer={reducer}
        body={parcel.toJSON()}
        onStart={onStart}
        onFinish={onFinish}
        onError={onError} />
};
