import * as _ from "lodash";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { AggsUTXODoc } from "codechain-indexer-types";
import { Link } from "react-router-dom";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";
import "./AssetList.scss";

interface Props {
    aggsUTXO: AggsUTXODoc[];
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
        const { aggsUTXO } = this.props;
        const loadedAsset = aggsUTXO.slice(0, this.itemPerPage * page);
        return (
            <div className="asset-list">
                <Row>
                    <Col>
                        <div className="d-flex justify-content-between align-items-end">
                            <h2>Assets</h2>
                            {<span>Total {aggsUTXO.length} assets</span>}
                        </div>
                        <hr className="heading-hr" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row>
                            {_.map(loadedAsset, (utxo, index) => {
                                return (
                                    <Col key={`asset-item-${index}`} lg="3" md="4" sm="6" className="mt-small">
                                        <div className="asset-item d-flex">
                                            <div className="d-inline-block">
                                                <ImageLoader
                                                    size={50}
                                                    data={utxo.assetType}
                                                    className="icon"
                                                    isAssetImage={true}
                                                />
                                            </div>
                                            <div className="d-inline-block d-flex align-items-center asset-text-container">
                                                <div>
                                                    <Link to={`/asset/0x${utxo.assetType}`}>
                                                        <div className="asset-name">AssetName(not implemented)</div>
                                                    </Link>
                                                    <div>
                                                        <span>x {utxo.totalAssetQuantity.toLocaleString()}</span>
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
                {this.itemPerPage * page < aggsUTXO.length && (
                    <Row>
                        <Col>
                            <div className="mt-small">
                                <button className="btn btn-primary w-100" onClick={this.loadMore}>
                                    Load Assets
                                </button>
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        );
    }

    private loadMore = (e: any) => {
        e.preventDefault();
        this.setState({ page: this.state.page + 1 });
    };
}

export default AssetList;
