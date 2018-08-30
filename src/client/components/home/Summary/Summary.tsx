import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { Col, Row } from "reactstrap";
const { ResponsiveLine } = require("@nivo/line");
const { ResponsivePie } = require("@nivo/pie");

import {
    RequestBlockNumber,
    RequestDailyLogs,
    RequestWeeklyLogs
} from "../../../request";
import { DailyLogType } from "../../../request/RequestDailyLogs";
import { WeeklyLogType } from "../../../request/RequestWeeklyLogs";
import * as emptyImage from "./img/empty.png";
import "./Summary.scss";

interface State {
    weeklyLogs: Array<{
        x: string;
        y: string;
    }>;
    isWeeklyLogRequested: boolean;
    type: WeeklyLogType;
    isDailyLogRequested: boolean;
    dailyLogType: DailyLogType;
    dailyLogs: Array<{
        id: string;
        label: string;
        value: number;
        color: string;
    }>;
    selectedDate: string;
    isEmptyForDailyLog: boolean;
    bestBlockNumber?: number;
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
            selectedDate: moment()
                .utc()
                .format("YYYY-MM-DD"),
            isEmptyForDailyLog: false,
            bestBlockNumber: undefined
        };
    }
    public render() {
        const {
            weeklyLogs,
            isWeeklyLogRequested,
            type,
            isDailyLogRequested,
            dailyLogType,
            dailyLogs,
            selectedDate,
            isEmptyForDailyLog,
            bestBlockNumber
        } = this.state;
        const before7days = moment()
            .utc()
            .subtract(6, "days")
            .format("YYYY-MM-DD");
        const today = moment()
            .utc()
            .format("YYYY-MM-DD");
        const lastWeeklyLog = _.last(weeklyLogs);
        return (
            <div className="summary">
                <RequestBlockNumber
                    repeat={10000}
                    onBlockNumber={this.onBlockNumber}
                    onError={this.onError}
                />
                {!isWeeklyLogRequested ? (
                    <RequestWeeklyLogs
                        type={type}
                        onData={this.onWeeklyLogData}
                        onError={this.onError}
                    />
                ) : null}
                {!isDailyLogRequested ? (
                    <RequestDailyLogs
                        onEmptyResult={this.onEmptyResult}
                        type={dailyLogType}
                        date={selectedDate}
                        onData={this.onDailyLogData}
                        onError={this.onError}
                    />
                ) : null}
                <Row>
                    <Col lg="6">
                        <div className="chart-container">
                            <div className="chart">
                                <div className="header-part">
                                    <h2 className="title">
                                        Weekly {this.getWeeklyLogTitle(type)}{" "}
                                        log
                                    </h2>
                                    <p className="week">
                                        {before7days} ~ {today} (UTC+0000)
                                    </p>
                                    <select
                                        className="select"
                                        defaultValue={type}
                                        onChange={this.onWeeklyLogTypeChanged}
                                    >
                                        <option
                                            value={WeeklyLogType.BLOCK_COUNT}
                                        >
                                            Block
                                        </option>
                                        <option
                                            value={WeeklyLogType.PARCEL_COUNT}
                                        >
                                            Parcel
                                        </option>
                                        <option value={WeeklyLogType.TX_COUNT}>
                                            Tx
                                        </option>
                                    </select>
                                </div>
                                <div className="chart-item">
                                    <ResponsiveLine
                                        data={[
                                            {
                                                id: this.getWeeklyLogTitle(
                                                    type
                                                ),
                                                color: "hsl(237, 49%, 45%)",
                                                data: weeklyLogs
                                            }
                                        ]}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            bottom: 60,
                                            left: 60
                                        }}
                                        minY="auto"
                                        axisBottom={{
                                            orient: "bottom",
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legendOffset: 36
                                        }}
                                        axisLeft={{
                                            orient: "left",
                                            tickSize: 5,
                                            tickPadding: 5,
                                            tickRotation: 0,
                                            legendOffset: -40
                                        }}
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
                                <div className="weekly-total">
                                    Weekly total{" "}
                                    {_.reduce(
                                        weeklyLogs,
                                        (memo, log) =>
                                            parseInt(log.y, 10) + memo,
                                        0
                                    ).toLocaleString()}{" "}
                                    blocks (Total{" "}
                                    {bestBlockNumber
                                        ? bestBlockNumber.toLocaleString()
                                        : 0}{" "}
                                    blocks)
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg="6" className="mt-3 mt-lg-0">
                        <div className="chart-container">
                            <div className="chart">
                                <div className="header-part">
                                    <h2 className="title">
                                        Daily{" "}
                                        {this.getDailyLogTitle(dailyLogType)}{" "}
                                        log
                                    </h2>
                                    <p className="week">
                                        {selectedDate} (UTC+0000)
                                    </p>
                                    <span className="subtitle">
                                        {this.getDailyLogSubTitle(dailyLogType)}
                                    </span>
                                    <span className="subtitle-amount">
                                        {lastWeeklyLog
                                            ? parseInt(
                                                  lastWeeklyLog.y,
                                                  10
                                              ).toLocaleString()
                                            : 0}
                                    </span>
                                    <hr />
                                    <span className="subname">
                                        {this.getDailyLogSubName(dailyLogType)}
                                    </span>
                                </div>
                                <div className="chart-item">
                                    {isEmptyForDailyLog ? (
                                        <div className="empty-container align-items-center justify-content-center">
                                            <img
                                                className="empty-icon"
                                                src={emptyImage}
                                            />
                                            <div>
                                                <h3>Empty!</h3>
                                                <span>
                                                    There is no data to display.
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <ResponsivePie
                                            data={dailyLogs}
                                            margin={{
                                                top: 80,
                                                right: 80,
                                                bottom: 40,
                                                left: 80
                                            }}
                                            innerRadius={0.5}
                                            padAngle={0.7}
                                            // tslint:disable-next-line:jsx-no-lambda
                                            colorBy={(e: any) => e.color}
                                            borderWidth={1}
                                            borderColor="inherit:darker(0.2)"
                                            enableSlicesLabels={true}
                                            radialLabelsSkipAngle={10}
                                            radialLabelsTextXOffset={6}
                                            radialLabelsTextColor="#333333"
                                            radialLabelsLinkOffset={0}
                                            radialLabelsLinkDiagonalLength={16}
                                            radialLabelsLinkHorizontalLength={
                                                24
                                            }
                                            radialLabelsLinkStrokeWidth={1}
                                            radialLabelsLinkColor="inherit"
                                            slicesLabelsSkipAngle={10}
                                            slicesLabelsTextColor="#333333"
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
                                    )}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
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
        this.setState({
            isWeeklyLogRequested: false,
            type: event.target.value,
            dailyLogType,
            isDailyLogRequested: false,
            isEmptyForDailyLog: false
        });
    };

    private onEmptyResult = () => {
        this.setState({ isEmptyForDailyLog: true, isDailyLogRequested: true });
    };

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
    };

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
    };

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
    };

    private getDailyLogSubTitle = (type: DailyLogType) => {
        switch (type) {
            case DailyLogType.BEST_MINER:
                return "# of blocks";
            case DailyLogType.PARCEL_ACTION:
                return "# of parcels";
            case DailyLogType.TX_TYPE:
                return "# of transactions";
        }
        return "";
    };

    private onBlockNumber = (n: number) => {
        if (
            this.state.bestBlockNumber &&
            this.state.bestBlockNumber < n &&
            this.state.isDailyLogRequested &&
            this.state.isWeeklyLogRequested
        ) {
            this.setState({
                isDailyLogRequested: false,
                isWeeklyLogRequested: false
            });
        }
        this.setState({ bestBlockNumber: n });
    };

    private onWeeklyLogData = (
        weeklyLogs: Array<{
            x: string;
            y: string;
        }>
    ) => {
        this.setState({ weeklyLogs, isWeeklyLogRequested: true });
    };

    private onDailyLogData = (
        dailyLogs: Array<{
            id: string;
            label: string;
            value: number;
            color: string;
        }>
    ) => {
        this.setState({ dailyLogs, isDailyLogRequested: true });
    };

    private onError = (error: any) => {
        console.log(error);
    };
}

export default Summary;
