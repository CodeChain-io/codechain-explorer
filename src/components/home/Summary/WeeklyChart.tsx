import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
const { ResponsiveBar } = require("@nivo/bar");
const { ResponsiveLine } = require("@nivo/line");

import RequestWeeklyLogs, { WeeklyLogType } from "src/request/RequestWeeklyLogs";

type WeeklyChartData = Array<{
    date: string;
    "#": string;
    color: string;
    fullDate: string;
}>;

interface OwnProps {
    bestBlockNumber?: number;
    type: WeeklyLogType;
    chartType: "bar" | "line";
    title: string;
    onError: (err: any) => void;
}

interface State {
    data?: WeeklyChartData;
}

type Props = OwnProps;
class WeeklyChart extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        const before7days = moment()
            .utc()
            .subtract(6, "days")
            .format("YYYY-MM-DD");
        const today = moment()
            .utc()
            .format("YYYY-MM-DD");
        const { data } = this.state;
        const { type } = this.props;
        if (data == null) {
            return <RequestWeeklyLogs type={type} onData={this.onData} onError={this.props.onError} />;
        }
        const { title, bestBlockNumber, chartType } = this.props;
        return (
            <div className="chart-container">
                <div className="chart">
                    <div className="header-part">
                        <h2 className="title">{title}</h2>
                        <p className="week">
                            {before7days} ~ {today} (UTC)
                        </p>
                    </div>
                    <div className="chart-item">
                        {chartType === "bar" ? this.renderBarChart() : this.renderLineChart()}
                    </div>
                    <div className="weekly-total">
                        This week: {_.reduce(data, (memo, log) => parseInt(log["#"], 10) + memo, 0).toLocaleString()}{" "}
                        {this.getWeeklyTotalLabel(type)}
                        {type === WeeklyLogType.BLOCK_COUNT ? (
                            <span>
                                &nbsp;(Total acc.: {bestBlockNumber ? bestBlockNumber.toLocaleString() : 0} blocks)
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }

    private renderBarChart() {
        const { data } = this.state;
        return (
            <ResponsiveBar
                data={data}
                keys={["#"]}
                indexBy="date"
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

    private renderLineChart() {
        const { data } = this.state;
        return (
            <ResponsiveLine
                data={[
                    {
                        id: "# of TXs",
                        color: "hsl(191, 95%, 42%)",
                        data: data!.map(a => ({
                            x: a.date,
                            y: a["#"]
                        }))
                    }
                ]}
                margin={{
                    top: 20,
                    right: 30,
                    bottom: 50,
                    left: 80
                }}
                minY="auto"
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
        );
    }

    private onData = (data: WeeklyChartData) => {
        this.setState({ data });
    };

    private getWeeklyTotalLabel = (type: WeeklyLogType) => {
        switch (type) {
            case WeeklyLogType.BLOCK_COUNT:
                return "blocks";
            case WeeklyLogType.TX_COUNT:
                return "tx";
        }
        return "";
    };
}

export default WeeklyChart;
