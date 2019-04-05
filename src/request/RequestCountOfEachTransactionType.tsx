import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    blockNumber: number;
    onCounts: (results: { [type: string]: number }) => void;
    onError: (e: ApiError) => void;
    onBlockNotExist: () => void;
    progressBarTarget?: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;
class RequestCountOfEachTransactionType extends React.Component<Props> {
    public componentWillMount() {
        const { blockNumber, dispatch, progressBarTarget } = this.props;
        // FIXME: Cache the data.
        apiRequest({
            path: `/block/${blockNumber}/tx-count-types`,
            dispatch,
            progressBarTarget,
            showProgressBar: true
        })
            .then((response: unknown) => {
                if (response == null) {
                    this.props.onBlockNotExist();
                }
                this.props.onCounts(response as any);
            })
            .catch(this.props.onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestCountOfEachTransactionType);
