import * as React from "react";
const { ResponsiveStream } = require("@nivo/stream");

import "./DifficultyChart.scss";
import { getTestData } from "./testData";

class DifficultyChart extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render() {
        return (
            <div className="difficulty-chart">
                <div className="chart-container">
                    <div className="chart">
                        <div className="header-part">
                            <h2 className="title">Block Difficulty</h2>
                        </div>
                        <div className="chart-item">
                            <ResponsiveStream
                                data={getTestData()}
                                keys={[
                                    "Raoul",
                                    "Josiane",
                                    "Marcel",
                                    "René",
                                    "Paul",
                                    "Jacques"
                                ]}
                                margin={{
                                    "top": 0,
                                    "right": 30,
                                    "bottom": 50,
                                    "left": 60
                                }}
                                axisBottom={{
                                    "orient": "bottom",
                                    "tickSize": 5,
                                    "tickPadding": 5,
                                    "tickRotation": 0,
                                    "legend": "",
                                    "legendOffset": 36
                                }}
                                axisLeft={{
                                    "orient": "left",
                                    "tickSize": 5,
                                    "tickPadding": 5,
                                    "tickRotation": 0,
                                    "legend": "",
                                    "legendOffset": -40
                                }}
                                offsetType="none"
                                fillOpacity={0.85}
                                borderColor="#000"
                                defs={[
                                    {
                                        "id": "dots",
                                        "type": "patternDots",
                                        "background": "inherit",
                                        "color": "#2c998f",
                                        "size": 4,
                                        "padding": 2,
                                        "stagger": true
                                    },
                                    {
                                        "id": "squares",
                                        "type": "patternSquares",
                                        "background": "inherit",
                                        "color": "#e4c912",
                                        "size": 6,
                                        "padding": 2,
                                        "stagger": true
                                    }
                                ]}
                                fill={[
                                    {
                                        "match": {
                                            "id": "Paul"
                                        },
                                        "id": "dots"
                                    },
                                    {
                                        "match": {
                                            "id": "Marcel"
                                        },
                                        "id": "squares"
                                    }
                                ]}
                                animate={true}
                                motionStiffness={90}
                                motionDamping={15}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};

export default DifficultyChart;
