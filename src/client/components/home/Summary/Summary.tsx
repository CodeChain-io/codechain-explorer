import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { Col, Row } from "reactstrap";
const { ResponsiveBar } = require("@nivo/bar");
const { ResponsivePie } = require("@nivo/pie");
import { Redirect } from "react-router";

import { RequestBlockNumber, RequestDailyLogs, RequestWeeklyLogs } from "../../../request";
import { DailyLogType } from "../../../request/RequestDailyLogs";
import { WeeklyLogType } from "../../../request/RequestWeeklyLogs";
import * as emptyImage from "./img/empty.png";
import "./Summary.scss";

interface State {
    weeklyLogs: Array<{
        date: string;
        "#": string;
        color: string;
        fullDate: string;
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
    selectedIndex: number;
    isEmptyForDailyLog: boolean;
    bestBlockNumber?: number;
    selectedMinerAddress?: string;
}

class Summary extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            weeklyLogs: [],
            isWeeklyLogRequested: false,
            type: WeeklyLogType.BLOCK_COUNT,
            isDailyLogRequested: false,
            selectedIndex: 6,
            dailyLogType: DailyLogType.BEST_MINER,
            dailyLogs: [],
            selectedDate: moment()
                .utc()
                .format("YYYY-MM-DD"),
            isEmptyForDailyLog: false,
            bestBlockNumber: undefined,
            selectedMinerAddress: undefined
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
            bestBlockNumber,
            selectedIndex,
            selectedMinerAddress
        } = this.state;
        const before7days = moment()
            .utc()
            .subtract(6, "days")
            .format("YYYY-MM-DD");
        const today = moment()
            .utc()
            .format("YYYY-MM-DD");
        return (
            <div className="summary">
                {selectedMinerAddress ? <Redirect push={true} to={`/addr-platform/${selectedMinerAddress}`} /> : null}
                <RequestBlockNumber repeat={10000} onBlockNumber={this.onBlockNumber} onError={this.onError} />
                {!isWeeklyLogRequested ? (
                    <RequestWeeklyLogs type={type} onData={this.onWeeklyLogData} onError={this.onError} />
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
                                    <h2 className="title">Weekly {this.getWeeklyLogTitle(type)} log</h2>
                                    <p className="week">
                                        {before7days} ~ {today} (UTC)
                                    </p>
                                    <select
                                        className="select"
                                        defaultValue={type}
                                        onChange={this.onWeeklyLogTypeChanged}
                                    >
                                        <option value={WeeklyLogType.BLOCK_COUNT}>Block</option>
                                        <option value={WeeklyLogType.PARCEL_COUNT}>Parcel</option>
                                        <option value={WeeklyLogType.TX_COUNT}>Tx</option>
                                    </select>
                                </div>
                                <div className="chart-item">
                                    <ResponsiveBar
                                        data={weeklyLogs}
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
                                        onClick={this.onClickWeeklyLog}
                                    />
                                </div>
                                <div className="weekly-total">
                                    This week:{" "}
                                    {_.reduce(
                                        weeklyLogs,
                                        (memo, log) => parseInt(log["#"], 10) + memo,
                                        0
                                    ).toLocaleString()}{" "}
                                    {this.getWeeklyTotalLabel(type)}
                                    {type === WeeklyLogType.BLOCK_COUNT ? (
                                        <span>
                                            &nbsp;(Total acc.: {bestBlockNumber ? bestBlockNumber.toLocaleString() : 0}{" "}
                                            blocks)
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg="6" className="mt-3 mt-lg-0">
                        <div className={`chart-container daily-log-item ${this.getDailyLogTitle(dailyLogType)}`}>
                            <div className="chart">
                                <div className="header-part">
                                    <h2 className="title">Daily {this.getDailyLogTitle(dailyLogType)} log</h2>
                                    <p className="week">{selectedDate} (UTC)</p>
                                    <span className="subtitle">{this.getDailyLogSubTitle(dailyLogType)}</span>
                                    <span className="subtitle-amount">
                                        {weeklyLogs.length > 0
                                            ? parseInt(weeklyLogs[selectedIndex]["#"], 10).toLocaleString()
                                            : 0}
                                    </span>
                                    <hr />
                                    <span className="subname">{this.getDailyLogSubName(dailyLogType)}</span>
                                </div>
                                <div className="chart-item">
                                    {isEmptyForDailyLog ? (
                                        <div className="empty-container align-items-center justify-content-center">
                                            <img className="empty-icon" src={emptyImage} />
                                            <div>
                                                <h3>Empty!</h3>
                                                <span>There is no data to display.</span>
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
                                            radialLabelsLinkHorizontalLength={24}
                                            radialLabelsLinkStrokeWidth={1}
                                            radialLabelsLinkColor="inherit"
                                            slicesLabelsSkipAngle={10}
                                            slicesLabelsTextColor="#333333"
                                            animate={true}
                                            motionStiffness={90}
                                            motionDamping={15}
                                            onClick={this.onClickDailyLog}
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

    private onClickWeeklyLog = (event: any) => {
        this.setState({
            selectedDate: event.data.fullDate,
            isDailyLogRequested: false,
            selectedIndex: event.index,
            isEmptyForDailyLog: false
        });
    };

    private onClickDailyLog = (event: any) => {
        this.setState({ selectedMinerAddress: event.minerAddress });
    };

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

    private getWeeklyTotalLabel = (type: WeeklyLogType) => {
        switch (type) {
            case WeeklyLogType.BLOCK_COUNT:
                return "blocks";
            case WeeklyLogType.TX_COUNT:
                return "tx";
            case WeeklyLogType.PARCEL_COUNT:
                return "parcels";
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
            date: string;
            "#": string;
            color: string;
            fullDate: string;
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
