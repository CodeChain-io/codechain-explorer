import * as React from "react";
const { ResponsiveLine } = require("@nivo/line");

import "./DifficultyChart.scss";

interface Props {
    difficulty: Array<{
        x: string,
        y: string
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
                            <p className="week">Last 25 blocks</p>
                        </div>
                        <div className="chart-item">
                            <ResponsiveLine
                                data={
                                    [
                                        {
                                            "id": "block",
                                            "color": "hsl(237, 49%, 45%)",
                                            "data": difficulty
                                        }
                                    ]
                                }
                                margin={{
                                    "top": 20,
                                    "right": 30,
                                    "bottom": 50,
                                    "left": 80
                                }}
                                minY="0"
                                axisBottom={{
                                    "orient": "bottom",
                                    "tickSize": 5,
                                    "tickPadding": 5,
                                    "tickRotation": 0,
                                    "legendOffset": 36,
                                    "legend": "Block number",
                                }}
                                axisLeft={{
                                    "orient": "left",
                                    "tickSize": 5,
                                    "tickPadding": 5,
                                    "tickRotation": 0,
                                    "legendOffset": -60,
                                    "legend": "Score",
                                }}
                                curve="natural"
                                // tslint:disable-next-line:jsx-no-lambda
                                colorBy={(e: any) => (e.color)}
                                dotSize={10}
                                dotColor="inherit:darker(0.3)"
                                dotBorderWidth={2}
                                enableGridX={false}
                                dotBorderColor="#ffffff"
                                enableDotLabel={false}
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
