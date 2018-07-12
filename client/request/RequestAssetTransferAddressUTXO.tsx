import * as React from "react";
import * as _ from "lodash";
import { Asset, AssetScheme } from "codechain-sdk/lib/core/classes";

import { apiRequest, ApiError } from "./ApiRequest";

interface UTXO {
    asset: Asset,
    assetScheme: AssetScheme
}

interface OwnProps {
    address: string;
    onUTXO: (utxo: UTXO[]) => void;
    onError: (e: ApiError) => void;
}

class RequestAssetTransferAddressUTXO extends React.Component<OwnProps> {
    public componentWillMount() {
        const { address, onUTXO, onError } = this.props;
        apiRequest({ path: `addr-asset-utxo/${address}` }).then((response) => {
            onUTXO(_.map(response, (res: UTXO) => {
                return {
                    asset: Asset.fromJSON(res.asset),
                    assetScheme: AssetScheme.fromJSON(res.assetScheme)
                }
            }));
        }).catch(onError);
    }

    public render() {
        return (null);
    }
}

export default RequestAssetTransferAddressUTXO;
