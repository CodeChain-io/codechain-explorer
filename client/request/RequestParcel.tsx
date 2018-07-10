import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { SignedParcel, H256 } from "codechain-sdk";

import { RootState } from "../redux/actions";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    hash: string;
    onParcel: (parcel: SignedParcel) => void;
    onParcelNotExist: () => void;
    onError: (e: ApiError) => void;
}

interface StateProps {
    cached?: SignedParcel;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & StateProps & DispatchProps;

class RequestParcelInternal extends React.Component<Props> {
    public componentWillMount() {
        const { cached, dispatch, hash, onParcel, onParcelNotExist, onError } = this.props;
        if (cached) {
            setTimeout(() => onParcel(cached));
            return;
        }
        apiRequest({ path: `parcel/${hash}` }).then((response: object) => {
            if (response === null) {
                return onParcelNotExist();
            }
            const parcel = SignedParcel.fromJSON(response);
            dispatch({
                type: "CACHE_PARCEL",
                data: parcel
            });
            onParcel(parcel);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestParcel = connect((state: RootState, props: OwnProps) => {
    if (props.hash.length === 66 || props.hash.length === 64) {
        return { cached: state.parcelByHash[new H256(props.hash).value] };
    }
    return { cached: state.parcelByHash[props.hash] };
}, (dispatch: Dispatch) => ({ dispatch }))(RequestParcelInternal);

export default RequestParcel;
