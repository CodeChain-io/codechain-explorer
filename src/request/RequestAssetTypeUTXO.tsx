import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AggsUTXODoc } from "codechain-indexer-types";
import { ApiError, apiRequest } from "./ApiRequest";

export interface AggsUTXOResponse {
    data: AggsUTXODoc[];
}

// FIXME: Support pagination
interface OwnProps {
    assetType: string;
    onAggsUTXOs: (aggsUTXOs: AggsUTXODoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestAssetTypeUTXO extends React.Component<Props> {
    public componentWillMount() {
        const { assetType, onAggsUTXOs, onError, dispatch } = this.props;
        const path = `aggs-utxo?assetType=${assetType}&itemsPerPage=100`;
        apiRequest({ path, dispatch, showProgressBar: false })
            .then((response: AggsUTXOResponse) => {
                onAggsUTXOs(response.data);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestAssetTypeUTXO);
