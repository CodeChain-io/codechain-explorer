import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { PendingParcelDoc } from "codechain-es/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

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
        apiRequest({
            path: `parcel/pending/${hash}`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: any) => {
                if (response === null) {
                    return onPendingParcelNotExist();
                }
                onPendingParcel(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestPendingParcel = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestPendingParcelInternal);

export default RequestPendingParcel;
