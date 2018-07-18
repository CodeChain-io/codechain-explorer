import * as React from "react";

import "./AssetHeaderTable.scss"
import HexString from "../../util/HexString/HexString";
import { AssetSchemeDoc, Type } from "../../../db/DocType";

interface OwnProps {
    assetScheme: AssetSchemeDoc;
}

const AssetHeaderTable = (prop: OwnProps) => {
    const metadata = Type.getMetadata(prop.assetScheme.metadata);
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
                <td>{prop.assetScheme.registrar ? <HexString link={`/addr-platform/0x${prop.assetScheme.registrar}`} text={prop.assetScheme.registrar} /> : "Not existed"}</td>
            </tr>
            <tr>
                <td>Description</td>
                <td>{metadata.description ? metadata.description : "Unknown"}</td>
            </tr>
        </tbody>
    </table>
};

export default AssetHeaderTable;
