import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    onParcelTotalCount: (parcelTotalCount: number) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestTotalParcelCountInternal extends React.Component<Props> {
    public componentWillMount() {
        const { onError, onParcelTotalCount, dispatch } = this.props;
        apiRequest({
            path: `parcels/totalCount`,
            dispatch,
            showProgressBar: true
        })
            .then((response: any) => {
                onParcelTotalCount(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestTotalParcelCount = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestTotalParcelCountInternal);

export default RequestTotalParcelCount;
