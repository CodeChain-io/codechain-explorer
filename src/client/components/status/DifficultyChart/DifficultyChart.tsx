import * as React from "react";
const { ResponsiveStream } = require("@nivo/stream");

import "./DifficultyChart.scss";

interface Props {
    difficulty: Array<{
        Score: number;
    }>
}

class DifficultyChart extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { difficulty } = this.props;
        return (
            <div className="difficulty-chart">
                <div className="chart-container">
                    <div className="chart">
                        <div className="header-part">
                            <h2 className="title">Block Difficulty</h2>
                            <p className="week">Last 10 blocks</p>
                        </div>
                        <div className="chart-item">
                            <ResponsiveStream
                                data={difficulty}
                                keys={[
                                    "Score"
                                ]}
                                margin={{
                                    "top": 10,
                                    "right": 30,
                                    "bottom": 50,
                                    "left": 90
                                }}
                                axisBottom={{
                                    "orient": "bottom",
                                    "tickSize": 5,
                                    "tickPadding": 5,
                                    "tickRotation": 0,
                                    "legend": "Block number",
                                    "legendOffset": 36
                                }}
                                axisLeft={{
                                    "orient": "left",
                                    "tickSize": 5,
                                    "tickPadding": 5,
                                    "tickRotation": 0,
                                    "legend": "Score",
                                    "legendOffset": -60
                                }}
                                colors="paired"
                                enableGridX={false}
                                enableGridY={true}
                                offsetType="none"
                                fillOpacity={0.85}
                                borderColor="#000"
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
