import * as _ from "lodash";
import * as React from "react";
const { ResponsiveLine } = require("@nivo/line");

interface Props {
    transactions: Array<{
        x: string;
        y: string;
    }>;
}

class TransactionChart extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        const { transactions } = this.props;
        const first = _.first(transactions);
        const last = _.last(transactions);
        let tickValues: any = [];
        if (first && last) {
            tickValues = [first.x, last.x];
        }
        return (
            <div className="transaction-chart">
                <div className="chart-container">
                    <div className="chart">
                        <div className="header-part">
                            <h2 className="title">Block transactions</h2>
                            <p className="week">Last 50 blocks</p>
                        </div>
                        <div className="chart-item">
                            <ResponsiveLine
                                data={[
                                    {
                                        id: "# of TXs",
                                        color: "hsl(191, 95%, 42%)",
                                        data: transactions
                                    }
                                ]}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    bottom: 50,
                                    left: 80
                                }}
                                minY="auto"
                                axisBottom={{
                                    legendOffset: 36,
                                    legend: "Block number",
                                    tickValues
                                }}
                                axisLeft={{
                                    orient: "left",
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legendOffset: -60,
                                    legend: "# of TXs"
                                }}
                                enableDots={false}
                                enableArea={true}
                                // tslint:disable-next-line:jsx-no-lambda
                                colorBy={(e: any) => e.color}
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
        );
    }
}

export default TransactionChart;
