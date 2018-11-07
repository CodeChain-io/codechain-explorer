import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { PendingParcelDoc } from "codechain-indexer-types/lib/types";
import { Type } from "codechain-indexer-types/lib/utils";
import { H256 } from "codechain-sdk/lib/core/classes";
import { RootState } from "../redux/actions";
import { getCurrentTimestamp } from "../utils/Time";
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

interface StateProps {
    cached?: { data: PendingParcelDoc; updatedAt: number };
}

type Props = OwnProps & DispatchProps & StateProps;

class RequestPendingParcel extends React.Component<Props> {
    public componentWillMount() {
        const {
            onPendingParcel,
            onError,
            onPendingParcelNotExist,
            hash,
            dispatch,
            progressBarTarget,
            cached
        } = this.props;
        if (cached && getCurrentTimestamp() - cached.updatedAt < 10) {
            setTimeout(() => onPendingParcel(cached.data));
            return;
        }
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

export default connect((state: RootState, props: OwnProps) => {
    let cacheKey = props.hash;
    if (Type.isH256String(cacheKey)) {
        cacheKey = new H256(cacheKey).value;
    }
    const cachedPendingParcel = state.appReducer.pendingParcelByHash[cacheKey];
    return {
        cached: cachedPendingParcel && {
            data: cachedPendingParcel.data,
            updatedAt: cachedPendingParcel.updatedAt
        }
    };
})(RequestPendingParcel);
