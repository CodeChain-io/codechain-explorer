import * as _ from "lodash";
import * as React from "react";
const { ResponsiveBar } = require("@nivo/bar");

import { BlockDoc } from "codechain-indexer-types";

interface OwnProps {
    blocks: BlockDoc[];
}

type Props = OwnProps;
class TransactionsCountByTypeChart extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <div className="chart-container">
                <div className="chart">
                    <div className="header-part">
                        <h2 className="title">Transactions</h2>
                    </div>
                    <div className="chart-item">{this.renderBarChart()}</div>
                </div>
            </div>
        );
    }

    private renderBarChart() {
        const { blocks } = this.props;
        const types = Object.keys(blocks.reduce((prev, block) => ({ ...prev, ...block.transactionsCountByType }), {}));
        const max = _.max(blocks.map(b => _.sum(_.values(b.transactionsCountByType))));
        const data = blocks
            .map(block => {
                return {
                    ...block.transactionsCountByType,
                    blockNumber: block.number.toString()
                };
            })
            .reverse();
        return (
            <ResponsiveBar
                data={data}
                keys={types}
                indexBy="blockNumber"
                margin={{
                    top: 20,
                    right: 30,
                    bottom: 50,
                    left: 60
                }}
                padding={0.3}
                colors="nivo"
                borderColor="inherit:darker(1.6)"
                enableLabel={false}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="inherit:darker(1.6)"
                maxValue={_.max([max, 5])}
                axisLeft={{
                    format: (tick: string) => (tick.indexOf(".") === -1 ? tick : "")
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

export default TransactionsCountByTypeChart;
