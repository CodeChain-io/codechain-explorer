import * as React from "react";
import * as _ from "lodash";

import "./AssetList.scss";
import HexString from "../../util/HexString/HexString";
import { AssetBundleDoc, Type } from "../../../db/DocType";

interface OwnProps {
    assetBundles: AssetBundleDoc[]
}

const AssetList = (prop: OwnProps) => {
    return <div className="asset-list-container mb-3">
        {
            _.map(prop.assetBundles, (assetBundle, index) => {
                const metadata = Type.getMetadata(assetBundle.assetScheme.metadata);
                return <table key={`asset-list-${index}`} className="asset-list-table">
                    <tbody>
                        <tr>
                            <td rowSpan={2}>
                                Asset
                            </td>
                            <td>
                                <HexString text={assetBundle.asset.assetType} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table className="inner-table">
                                    <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td>{metadata.name ? metadata.name : "Unknown"}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Description
                                            </td>
                                            <td>
                                                {metadata.description ? metadata.description : "Unknown"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Icon
                                            </td>
                                            <td>
                                                {metadata.icon_url ? <img className="asset-icon" src={metadata.icon_url} /> : "Unknown"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Amount
                                            </td>
                                            <td>
                                                {assetBundle.asset.amount}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            })
        }
    </div>
};

export default AssetList;
