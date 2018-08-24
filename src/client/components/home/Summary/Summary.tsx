import * as React from "react";
import { Row, Col } from "reactstrap";
import * as moment from "moment";
const { ResponsiveLine } = require("@nivo/line");
const { ResponsivePie } = require("@nivo/pie");

import "./Summary.scss";
import * as emptyImage from "./img/empty.png"
import { RequestWeeklyLogs, RequestDailyLogs } from "../../../request";
import { WeeklyLogType } from "../../../request/RequestWeeklyLogs";
import { DailyLogType } from "../../../request/RequestDailyLogs";

interface State {
    weeklyLogs: Array<{
        x: string,
        y: string
    }>;
    isWeeklyLogRequested: boolean;
    type: WeeklyLogType;
    isDailyLogRequested: boolean;
    dailyLogType: DailyLogType;
    dailyLogs: Array<{
        id: string,
        label: string,
        value: number,
        color: string
    }>;
    selectedDate: string;
    isEmptyForDailyLog: boolean;
}

class Summary extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            weeklyLogs: [],
            isWeeklyLogRequested: false,
            type: WeeklyLogType.BLOCK_COUNT,
            isDailyLogRequested: false,
            dailyLogType: DailyLogType.BEST_MINER,
            dailyLogs: [],
            selectedDate: moment().utc().format("YYYY-MM-DD"),
            isEmptyForDailyLog: false
        }
    }
    public render() {
        const { weeklyLogs, isWeeklyLogRequested, type, isDailyLogRequested, dailyLogType, dailyLogs, selectedDate, isEmptyForDailyLog } = this.state;
        const before7days = moment().utc().subtract(6, "days").format("YYYY-MM-DD");
        const today = moment().utc().format("YYYY-MM-DD");
        return (
            <div className="summary">
                {
                    !isWeeklyLogRequested ?
                        <RequestWeeklyLogs type={type} onData={this.onWeeklyLogData} onError={this.onError} /> : null
                }
                {
                    !isDailyLogRequested ?
                        <RequestDailyLogs onEmptyResult={this.onEmptyResult} type={dailyLogType} date={selectedDate} onData={this.onDailyLogData} onError={this.onError} /> : null
                }
                <Row>
                    <Col lg="6">
                        <div className="chart-container">
                            <div className="chart">
                                <div className="header-part">
                                    <h2 className="title">Weekly {this.getWeeklyLogTitle(type)} log</h2>
                                    <p className="week">{before7days} ~ {today} (UTC+0000)</p>
                                    <select className="select" defaultValue={type} onChange={this.onWeeklyLogTypeChanged}>
                                        <option value={WeeklyLogType.BLOCK_COUNT}>Block</option>
                                        <option value={WeeklyLogType.PARCEL_COUNT}>Parcel</option>
                                        <option value={WeeklyLogType.TX_COUNT}>Tx</option>
                                    </select>
                                </div>
                                <div className="chart-item">
                                    <ResponsiveLine
                                        data={
                                            [
                                                {
                                                    "id": "block",
                                                    "color": "hsl(237, 49%, 45%)",
                                                    "data": weeklyLogs
                                                }
                                            ]
                                        }
                                        margin={{
                                            "top": 20,
                                            "right": 30,
                                            "bottom": 50,
                                            "left": 60
                                        }}
                                        minY="auto"
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
                    </Col>
                    <Col lg="6" className="mt-3 mt-lg-0">
                        <div className="chart-container">
                            <div className="chart">
                                <div className="header-part">
                                    <h2 className="title">Daily {this.getDailyLogTitle(dailyLogType)} log</h2>
                                    <p className="week">{selectedDate} (UTC+0000)</p>
                                    <hr />
                                    <span className="subname">{this.getDailyLogSubName(dailyLogType)}</span>
                                </div>
                                <div className="chart-item">
                                    {
                                        isEmptyForDailyLog ?
                                            <div className="empty-container align-items-center justify-content-center">
                                                <img className="empty-icon" src={emptyImage} />
                                                <div>
                                                    <h3>Empty!</h3>
                                                    <span>There is no data to display.</span>
                                                </div>
                                            </div> :
                                            <ResponsivePie
                                                data={dailyLogs}
                                                margin={{
                                                    "top": 40,
                                                    "right": 80,
                                                    "bottom": 30,
                                                    "left": 80
                                                }}
                                                innerRadius={0.5}
                                                padAngle={0.7}
                                                // tslint:disable-next-line:jsx-no-lambda
                                                colorBy={(e: any) => (e.color)}
                                                borderWidth={1}
                                                borderColor="inherit:darker(0.2)"
                                                enableSlicesLabels={true}
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
                                    }
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

    private onWeeklyLogTypeChanged = (event: any) => {
        let dailyLogType = DailyLogType.BEST_MINER;
        switch (event.target.value) {
            case WeeklyLogType.BLOCK_COUNT:
                dailyLogType = DailyLogType.BEST_MINER;
                break;
            case WeeklyLogType.PARCEL_COUNT:
                dailyLogType = DailyLogType.PARCEL_ACTION;
                break;
            case WeeklyLogType.TX_COUNT:
                dailyLogType = DailyLogType.TX_TYPE;
                break;
        }
        this.setState({ isWeeklyLogRequested: false, type: event.target.value, dailyLogType, isDailyLogRequested: false, isEmptyForDailyLog: false });
    }

    private onEmptyResult = () => {
        this.setState({ isEmptyForDailyLog: true, isDailyLogRequested: true });
    }

    private getWeeklyLogTitle = (type: WeeklyLogType) => {
        switch (type) {
            case WeeklyLogType.BLOCK_COUNT:
                return "block";
            case WeeklyLogType.TX_COUNT:
                return "transaction";
            case WeeklyLogType.PARCEL_COUNT:
                return "parcel";
        }
        return "";
    }

    private getDailyLogTitle = (type: DailyLogType) => {
        switch (type) {
            case DailyLogType.BEST_MINER:
                return "block";
            case DailyLogType.PARCEL_ACTION:
                return "parcel";
            case DailyLogType.TX_TYPE:
                return "transaction";
        }
        return "";
    }

    private getDailyLogSubName = (type: DailyLogType) => {
        switch (type) {
            case DailyLogType.BEST_MINER:
                return "Top reward address";
            case DailyLogType.PARCEL_ACTION:
                return "Parcel actions";
            case DailyLogType.TX_TYPE:
                return "Transaction types";
        }
        return "";
    }

    private onWeeklyLogData = (weeklyLogs: Array<{
        x: string,
        y: string
    }>) => {
        this.setState({ weeklyLogs, isWeeklyLogRequested: true });
    }

    private onDailyLogData = (dailyLogs: Array<{
        id: string,
        label: string,
        value: number,
        color: string
    }>) => {
        this.setState({ dailyLogs, isDailyLogRequested: true });
    }

    private onError = (error: any) => {
        console.log(error);
    }
};

export default Summary;
