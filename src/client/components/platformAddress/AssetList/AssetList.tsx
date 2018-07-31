import * as React from "react";
import * as _ from "lodash";
import { Row, Col } from "reactstrap";

import "./AssetList.scss";
import { AssetBundleDoc, Type } from "../../../../db/DocType";
import { Link } from "react-router-dom";

interface OwnProps {
    assetBundles: AssetBundleDoc[]
}

const AssetList = (prop: OwnProps) => {
    return <div className="account-asset-list mt-4">
        <Row>
            <Col>
                <h2>Issued Assets</h2>
                <hr className="heading-hr mb-3" />
            </Col>
        </Row>
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
                                <div className="d-inline-block d-flex align-items-center asset-text-container">
                                    <div>
                                        <Link to={`/asset/0x${assetBundle.asset.assetType}`}>
                                            <h3 className="mb-0">{metadata.name}</h3>
                                        </Link>
                                        <div>
                                            <span>x {assetBundle.asset.amount}</span>
                                        </div>
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
