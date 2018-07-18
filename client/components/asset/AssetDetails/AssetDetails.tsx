import * as React from "react";

import "./AssetDetails.scss"
import AssetHeaderTable from "../AssetHeaderTable/AssetHeaderTable";
import { AssetSchemeDoc } from "../../../db/DocType";

interface OwnProps {
    assetScheme: AssetSchemeDoc;
}

const AssetDetails = (prop: OwnProps) => {
    return <div className="asset-detail-container mb-3">
        <h3 className="mt-3">Asset</h3>
        <AssetHeaderTable assetScheme={prop.assetScheme} />
    </div>
};

export default AssetDetails;
