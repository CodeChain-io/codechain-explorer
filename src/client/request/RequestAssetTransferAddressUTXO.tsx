import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AssetBundleDoc } from "codechain-es/lib/types";
import { ApiError, apiRequest } from "./ApiRequest";

interface OwnProps {
    lastTransactionHash?: string;
    itemsPerPage: number;
    address: string;
    onUTXO: (utxo: AssetBundleDoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestAssetTransferAddressUTXOInternal extends React.Component<Props> {
    public componentWillMount() {
        const { address, onUTXO, onError, dispatch, lastTransactionHash, itemsPerPage } = this.props;
        let path = `addr-asset-utxo/${address}?itemsPerPage=${itemsPerPage}`;
        if (lastTransactionHash) {
            path += `&lastTransactionHash=${lastTransactionHash}`;
        }
        apiRequest({ path, dispatch, showProgressBar: true })
            .then((response: AssetBundleDoc[]) => {
                onUTXO(response);
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
