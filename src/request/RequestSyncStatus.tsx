import * as React from "react";
import { connect, DispatchProp } from "react-redux";

import { ApiError, apiRequest } from "./ApiRequest";

export interface SyncData {
    codechainBestBlockNumber: number;
    codechainBestBlockHash: string;
    indexedBlockNumber: number;
    indexedBlockHash: string;
}

interface OwnProps {
    onSync: (sync: SyncData) => void;
    onError: (e: ApiError) => void;
}

type Props = OwnProps & DispatchProp;

class RequestSyncStatus extends React.Component<Props> {
    public componentWillMount() {
        const { onError, dispatch, onSync } = this.props;
        apiRequest({ path: `status/sync`, dispatch, showProgressBar: true })
            .then((response: any) => {
                onSync(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestSyncStatus);
