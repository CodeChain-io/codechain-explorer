import * as React from "react";

import { apiRequest, ApiError } from "./ApiRequest";
import { AssetBundleDoc } from "../db/DocType";

interface OwnProps {
    address: string;
    onUTXO: (utxo: AssetBundleDoc[]) => void;
    onError: (e: ApiError) => void;
}

class RequestAssetTransferAddressUTXO extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onUTXO, onError } = this.props;
        apiRequest({ path: `addr-asset-utxo/${address}` }).then((response: AssetBundleDoc[]) => {
            onUTXO(response);
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestAssetTransferAddressUTXO;
