import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { PendingParcelDoc } from "../../db/DocType";

interface OwnProps {
    onPendingParcel: (parcel: PendingParcelDoc) => void;
    onError: (e: ApiError) => void;
    onPendingParcelNotExist: () => void;
    progressBarTarget?: string;
    hash: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestPendingParcelInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onPendingParcel, onError, onPendingParcelNotExist, hash, dispatch, progressBarTarget } = this.props;
        apiRequest({ path: `parcel/pending/${hash}`, dispatch, progressBarTarget, showProgressBar: true }).then((response: any) => {
            if (response === null) {
                return onPendingParcelNotExist();
            }
            onPendingParcel(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestPendingParcel = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestPendingParcelInternal);

export default RequestPendingParcel;
