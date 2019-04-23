import * as React from "react";

import { AggsUTXODoc } from "codechain-indexer-types";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { CommaNumberString } from "src/components/util/CommaNumberString/CommaNumberString";
import DataTable from "src/components/util/DataTable/DataTable";
import { ImageLoader } from "src/components/util/ImageLoader/ImageLoader";
import "./AssetOwners.scss";
import AssetOwnersChart from "./AssetOwnersChart";

interface OwnProps {
    aggsUTXO: AggsUTXODoc[];
}

const AssetOwners = (prop: OwnProps) => {
    return (
        <div className="asset-details">
            <Row>
                <Col>
                    <h2>Asset Owners</h2>
                    <hr className="heading-hr" />
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col lg="6">
                    <DataTable>
                        <thead>
                            <tr>
                                <th style={{ width: "67%" }}>Address</th>
                                <th style={{ width: "33%" }} className="text-right">
                                    Quantity
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {prop.aggsUTXO.map((item: AggsUTXODoc) => {
                                return (
                                    <tr key={`raw-${item.address}`} className="animated fadeIn">
                                        <td>
                                            <ImageLoader
                                                className="mr-2"
                                                size={18}
                                                data={item.address}
                                                isAssetImage={true}
                                            />
                                            <Link to={`/addr-asset/${item.address}`}>{item.address}</Link>
                                        </td>
                                        <td className="text-right">
                                            <CommaNumberString text={item.totalAssetQuantity} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </DataTable>
                </Col>
                <Col md="6">
                    <AssetOwnersChart aggsUTXO={prop.aggsUTXO} />
                </Col>
            </Row>
        </div>
    );
};

export default AssetOwners;
