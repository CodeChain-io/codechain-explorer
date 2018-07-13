import * as React from "react";
import * as _ from "lodash";
import { Asset, AssetScheme } from "codechain-sdk/lib/core/classes";

import "./UTXOList.scss";
import HexString from "../../util/HexString/HexString";

interface OwnProps {
    utxo: Array<{
        asset: Asset,
        assetScheme: AssetScheme
    }>;
}

interface MetadataFormat {
    name?: string;
    description?: string;
    icon_url?: string;
}

const getMetadata = (data: string): MetadataFormat => {
    try {
        return JSON.parse(data);
    } catch (e) {
        // nothing
    }
    return {};
}

const UTXOList = (prop: OwnProps) => {
    return <div className="asset-transfer-address-detail-container mb-3">
        <table className="asset-transfer-address-header-table">
            <tbody>
                {
                    _.map(prop.utxo, (utxo, index) => {
                        const metadata = getMetadata(utxo.assetScheme.metadata);
                        return <tr key={`asset-transfer-utxo-${index}`}>
                            <td>
                                Asset
                            </td>
                            <td>
                                <table className="inner-table">
                                    <tbody>
                                        <tr>
                                            <td>AssetType</td>
                                            <td><HexString link={`/asset/0x${utxo.asset.assetType.value}`} text={utxo.asset.assetType.value} /></td>
                                        </tr>
                                        <tr>
                                            <td>Amount</td>
                                            <td>{utxo.asset.amount}</td>
                                        </tr>
                                        <tr>
                                            <td>Name</td>
                                            <td>{metadata.name ? metadata.name : "Unknown"}</td>
                                        </tr>
                                        <tr>
                                            <td>Icon</td>
                                            <td>{metadata.icon_url ? <img className="asset-icon" src={metadata.icon_url} /> : "Unknown"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    </div>
};

export default UTXOList;
