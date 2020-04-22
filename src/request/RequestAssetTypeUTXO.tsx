import * as React from "react";
import { connect, DispatchProp } from "react-redux";

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

type Props = OwnProps & DispatchProp;

class RequestAssetTypeUTXO extends React.Component<Props> {
    public componentWillMount() {
        const { assetType, onAggsUTXOs, onError, dispatch } = this.props;

        const max32bit = 2147483647;
        const path = `aggs-utxo?assetType=${assetType}&itemsPerPage=${max32bit - 10}`;
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
