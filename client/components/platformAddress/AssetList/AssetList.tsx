import * as React from "react";
import * as _ from "lodash";
import { Row, Col } from "reactstrap";

import "./AssetList.scss";
import { AssetBundleDoc, Type } from "../../../db/DocType";
import { Link } from "react-router-dom";

interface OwnProps {
    assetBundles: AssetBundleDoc[]
}

const AssetList = (prop: OwnProps) => {
    return <div className="asset-list">
        <Row>
            {
                _.map(prop.assetBundles, (assetBundle, index) => {
                    const metadata = Type.getMetadata(assetBundle.assetScheme.metadata);
                    return (
                        <Col key={`asset-item-${index}`} lg="3" md="4" sm="6" className="mb-3">
                            <div className="asset-item d-flex">
                                <div className="d-inline-block">
                                    <img src={metadata.icon_url} className="icon" />
                                </div>
                                <div className="d-inline-block mr-auto d-flex align-items-center">
                                    <div>
                                        <h4 className="mb-0"><Link to={`/asset/0x${assetBundle.asset.assetType}`}>{metadata.name}</Link></h4>
                                        <span>X {assetBundle.asset.amount}</span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    );
                })
            }
        </Row>
    </div>
};

export default AssetList;
