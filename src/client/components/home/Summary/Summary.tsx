import * as React from "react";
import { Row, Col } from "reactstrap";
const { ResponsiveLine } = require("@nivo/line");
const { ResponsivePie } = require("@nivo/pie");

import "./Summary.scss";
import { getTestLineData, getTestPieData } from "./testData";

class Summary extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }
    public render() {
        return <div className="summary">
            <h1>Summary</h1>
            <Row>
                <Col lg="6">
                    <div className="chart-container">
                        <div className="chart">
                            <div className="header-part">
                                <h2 className="title">Weekly transaction log</h2>
                                <p className="week">2018-08-05 ~ 2018-08-12</p>
                                <select className="select" defaultValue={"block"}>
                                    <option value="block">block</option>
                                    <option value="parcel">parcel</option>
                                    <option value="tx">tx</option>
                                </select>
                            </div>
                            <div className="chart-item">
                                <ResponsiveLine
                                    data={getTestLineData()}
                                    margin={{
                                        "top": 20,
                                        "right": 30,
                                        "bottom": 50,
                                        "left": 60
                                    }}
                                    minY="auto"
                                    stacked={true}
                                    axisBottom={{
                                        "orient": "bottom",
                                        "tickSize": 5,
                                        "tickPadding": 5,
                                        "tickRotation": 0,
                                        "legendOffset": 36
                                    }}
                                    axisLeft={{
                                        "orient": "left",
                                        "tickSize": 5,
                                        "tickPadding": 5,
                                        "tickRotation": 0,
                                        "legendOffset": -40
                                    }}
                                    // tslint:disable-next-line:jsx-no-lambda
                                    colorBy={(e: any) => (e.color)}
                                    dotSize={10}
                                    dotColor="inherit:darker(0.3)"
                                    dotBorderWidth={2}
                                    dotBorderColor="#ffffff"
                                    enableDotLabel={true}
                                    dotLabel="y"
                                    dotLabelYOffset={-12}
                                    animate={true}
                                    motionStiffness={90}
                                    motionDamping={15}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
                <Col lg="6" className="mt-3 mt-lg-0">
                    <div className="chart-container">
                        <div className="chart">
                            <div className="header-part">
                                <h2 className="title">Daily transaction log</h2>
                                <p className="week">2018-08-12</p>
                            </div>
                            <div className="chart-item">
                                <ResponsivePie
                                    data={getTestPieData()}
                                    margin={{
                                        "top": 40,
                                        "right": 80,
                                        "bottom": 30,
                                        "left": 80
                                    }}
                                    innerRadius={0.5}
                                    padAngle={0.7}
                                    cornerRadius={3}
                                    // tslint:disable-next-line:jsx-no-lambda
                                    colorBy={(e: any) => (e.color)}
                                    borderWidth={1}
                                    borderColor="inherit:darker(0.2)"
                                    radialLabelsSkipAngle={10}
                                    radialLabelsTextXOffset={6}
                                    radialLabelsTextColor="#333333"
                                    radialLabelsLinkOffset={0}
                                    radialLabelsLinkDiagonalLength={16}
                                    radialLabelsLinkHorizontalLength={24}
                                    radialLabelsLinkStrokeWidth={1}
                                    radialLabelsLinkColor="inherit"
                                    slicesLabelsSkipAngle={10}
                                    slicesLabelsTextColor="#333333"
                                    animate={true}
                                    motionStiffness={90}
                                    motionDamping={15}
                                    theme={{
                                        "tooltip": {
                                            "container": {
                                                "fontSize": "13px"
                                            }
                                        },
                                        "labels": {
                                            "textColor": "#555"
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    }
};

export default Summary;
