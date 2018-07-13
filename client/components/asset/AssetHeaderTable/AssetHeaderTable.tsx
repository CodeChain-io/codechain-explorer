import * as React from "react";

import "./AssetHeaderTable.scss"
import { AssetScheme } from "codechain-sdk/lib/core/classes";
import HexString from "../../util/HexString/HexString";

interface OwnProps {
    assetScheme: AssetScheme;
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

const AssetHeaderTable = (prop: OwnProps) => {
    const metadata = getMetadata(prop.assetScheme.metadata);
    return <table className="asset-header-table">
        <tbody>
            <tr>
                <td>Name</td>
                <td>{metadata.name ? metadata.name : "Unknown"}</td>
            </tr>
            <tr>
                <td>Icon</td>
                <td>{metadata.icon_url ? <img className="asset-icon" src={metadata.icon_url} /> : "Unknown"}</td>
            </tr>
            <tr>
                <td>Total</td>
                <td>{prop.assetScheme.amount}</td>
            </tr>
            <tr>
                <td>Registrar</td>
                <td>{prop.assetScheme.registrar ? (prop.assetScheme.registrar.value ? <HexString link={`/addr-platform/0x${prop.assetScheme.registrar.value}`} text={(prop.assetScheme.registrar.value as string)} /> : "Not existed") : "Not existed"}</td>
            </tr>
            <tr>
                <td>Description</td>
                <td>{metadata.description ? metadata.description : "Unknown"}</td>
            </tr>
        </tbody>
    </table>
};

export default AssetHeaderTable;
