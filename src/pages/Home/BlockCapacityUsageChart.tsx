import * as _ from "lodash";
import * as React from "react";
const { ResponsiveBar } = require("@nivo/bar");

import { BlockDoc } from "codechain-indexer-types";

interface OwnProps {
    blocks: BlockDoc[];
}

type Props = OwnProps;
class BlockCapacityUsageChart extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <div className="chart-container">
                <div className="chart">
                    <div className="header-part">
                        <h2 className="title">Block capacity usage</h2>
                    </div>
                    <div className="chart-item">{this.renderBarChart()}</div>
                </div>
            </div>
        );
    }

    private renderBarChart() {
        const { blocks } = this.props;
        const data = blocks
            .map(block => {
                return {
                    size: block.size,
                    blockNumber: block.number.toString(),
                    color: "hsl(191, 95%, 42%)"
                };
            })
            .reverse();
        return (
            <ResponsiveBar
                data={data}
                keys={["size"]}
                indexBy="blockNumber"
                margin={{
                    top: 20,
                    right: 30,
                    bottom: 50,
                    left: 60
                }}
                padding={0.3}
                colors="nivo"
                // tslint:disable-next-line:jsx-no-lambda
                colorBy={(e: any) => e.data.color}
                borderColor="inherit:darker(1.6)"
                enableLabel={false}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="inherit:darker(1.6)"
                axisLeft={{
                    format: (tick: string) => (parseInt(tick, 10) % 1000 !== 0 ? "" : parseInt(tick, 10) / 1000 + " KB")
                }}
                axisBottom={{
                    tickValues: this.bottomTickValues(data),
                    tickPadding: 10
                }}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                theme={{
                    tooltip: {
                        container: {
                            fontSize: "13px"
                        }
                    },
                    labels: {
                        textColor: "#555"
                    }
                }}
            />
        );
    }

    private bottomTickValues = (data: { blockNumber: string }[]) => {
        if (data.length >= 2) {
            return [_.first(data)!.blockNumber, _.last(data)!.blockNumber];
        } else {
            return undefined;
        }
    };
}

export default BlockCapacityUsageChart;
