import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AggsUTXO } from "codechain-indexer-types/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    itemsPerPage: number;
    address: string;
    page: number;
    onAggsUTXO: (aggsUTXO: AggsUTXO[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestAssetTransferAddressUTXOInternal extends React.Component<Props> {
    public componentWillMount() {
        const { address, onAggsUTXO, onError, dispatch, itemsPerPage, page } = this.props;
        const path = `aggs-utxo/${address}?itemsPerPage=${itemsPerPage}&page=${page}&isConfirmed=true`;
        apiRequest({ path, dispatch, showProgressBar: true })
            .then((response: AggsUTXO[]) => {
                onAggsUTXO(response);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

const RequestAssetTransferAddressUTXO = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestAssetTransferAddressUTXOInternal);

export default RequestAssetTransferAddressUTXO;
