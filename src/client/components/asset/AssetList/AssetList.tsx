import * as React from "react";
import * as _ from "lodash";
import { Row, Col } from "reactstrap";

import "./AssetList.scss";
import { AssetBundleDoc, Type } from "../../../../db/DocType";
import { Link } from "react-router-dom";

interface OwnProps {
    assetBundles: AssetBundleDoc[];
    fullScreen: boolean;
}

const AssetList = (prop: OwnProps) => {
    const { fullScreen } = prop;
    return <div className="asset-list mt-4">
        <Row>
            <Col lg={fullScreen ? "12" : "9"}>
                <h2>Assets</h2>
                <hr className="heading-hr mb-3" />
            </Col>
        </Row>
        <Row>
            <Col lg={fullScreen ? "12" : "9"}>
                <Row>
                    {
                        _.map(prop.assetBundles, (assetBundle, index) => {
                            const metadata = Type.getMetadata(assetBundle.assetScheme.metadata);
                            return (
                                <Col key={`asset-item-${index}`} lg={fullScreen ? "3" : "4"} md="4" sm="6" className="mb-3">
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
            </Col>
        </Row>
    </div>
};

export default AssetList;
