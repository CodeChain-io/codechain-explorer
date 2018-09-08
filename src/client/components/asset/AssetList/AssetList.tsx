import * as _ from "lodash";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { AssetBundleDoc } from "codechain-es/lib/types";
import { Type } from "codechain-es/lib/utils";
import { Link } from "react-router-dom";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";
import "./AssetList.scss";

interface Props {
    assetBundles: AssetBundleDoc[];
    loadMoreAction?: () => void;
    totalCount?: number;
    hideMoreButton?: boolean;
}

interface State {
    page: number;
}

class AssetList extends React.Component<Props, State> {
    private itemPerPage = 12;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1
        };
    }

    public render() {
        const { page } = this.state;
        const { assetBundles, loadMoreAction, totalCount, hideMoreButton } = this.props;
        let loadedAsset;
        if (loadMoreAction) {
            loadedAsset = assetBundles;
        } else {
            loadedAsset = assetBundles.slice(0, this.itemPerPage * page);
        }
        return (
            <div className="asset-list">
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-end">
                            <h2>Assets</h2>
                            {totalCount !== undefined ? <span>Total {totalCount} assets</span> : null}
                        </div>
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row>
                            {_.map(loadedAsset, (assetBundle, index) => {
                                const metadata = Type.getMetadata(assetBundle.assetScheme.metadata);
                                return (
                                    <Col key={`asset-item-${index}`} lg="3" md="4" sm="6" className="mt-small">
                                        <div className="asset-item d-flex">
                                            <div className="d-inline-block">
                                                <ImageLoader
                                                    size={50}
                                                    data={assetBundle.asset.assetType}
                                                    className="icon"
                                                    isAssetImage={true}
                                                />
                                            </div>
                                            <div className="d-inline-block d-flex align-items-center asset-text-container">
                                                <div>
                                                    <Link to={`/asset/0x${assetBundle.asset.assetType}`}>
                                                        <div className="asset-name">
                                                            {metadata.name
                                                                ? metadata.name
                                                                : assetBundle.asset.assetType}
                                                        </div>
                                                    </Link>
                                                    <div>
                                                        <span>x {assetBundle.asset.amount.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Col>
                </Row>
                {!hideMoreButton && (loadMoreAction || this.itemPerPage * page < assetBundles.length) ? (
                    <Row>
                        <Col>
                            <div className="mt-small">
                                <button className="btn btn-primary w-100" onClick={this.loadMore}>
                                    Load Assets
                                </button>
                            </div>
                        </Col>
                    </Row>
                ) : null}
            </div>
        );
    }

    private loadMore = (e: any) => {
        e.preventDefault();
        if (this.props.loadMoreAction) {
            this.props.loadMoreAction();
        } else {
            this.setState({ page: this.state.page + 1 });
        }
    };
}

export default AssetList;
