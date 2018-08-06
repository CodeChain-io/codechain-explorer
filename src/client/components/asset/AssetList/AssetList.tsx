import * as React from "react";
import * as _ from "lodash";
import { Row, Col } from "reactstrap";

import "./AssetList.scss";
import { AssetBundleDoc, Type } from "../../../../db/DocType";
import { Link } from "react-router-dom";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";

interface OwnProps {
    assetBundles: AssetBundleDoc[];
}

const AssetList = (prop: OwnProps) => {
    return <div className="asset-list">
        <Row>
            <Col>
                <h2>Assets</h2>
                <hr className="heading-hr" />
            </Col>
        </Row>
        <Row>
            <Col>
                <Row>
                    {
                        _.map(prop.assetBundles, (assetBundle, index) => {
                            const metadata = Type.getMetadata(assetBundle.assetScheme.metadata);
                            return (
                                <Col key={`asset-item-${index}`} lg="3" md="4" sm="6" className="mt-small">
                                    <div className="asset-item d-flex">
                                        <div className="d-inline-block">
                                            {
                                                metadata.icon_url ?
                                                    <ImageLoader size={50} url={metadata.icon_url} className="icon" />
                                                    : <ImageLoader size={50} data={assetBundle.asset.assetType} className="icon" />
                                            }
                                        </div>
                                        <div className="d-inline-block d-flex align-items-center asset-text-container">
                                            <div>
                                                <Link to={`/asset/0x${assetBundle.asset.assetType}`}>
                                                    {metadata.name}
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