import * as React from "react";
import { AssetScheme } from "codechain-sdk/lib/core/classes";

import "./AssetDetails.scss"
import AssetHeaderTable from "../AssetHeaderTable/AssetHeaderTable";

interface OwnProps {
    assetScheme: AssetScheme;
}

const AssetDetails = (prop: OwnProps) => {
    return <div className="asset-detail-container mb-3">
        <h3 className="mt-3">Asset</h3>
        <AssetHeaderTable assetScheme={prop.assetScheme} />
    </div>
};

export default AssetDetails;
