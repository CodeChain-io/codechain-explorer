import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { AssetBundleDoc } from "../../db/DocType";

interface OwnProps {
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
        const { address, onUTXO, onError, dispatch } = this.props;
        apiRequest({ path: `addr-asset-utxo/${address}`, dispatch }).then((response: AssetBundleDoc[]) => {
            onUTXO(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

const RequestAssetTransferAddressUTXO = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestAssetTransferAddressUTXOInternal);

export default RequestAssetTransferAddressUTXO;
