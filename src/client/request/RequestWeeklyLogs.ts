import * as React from "react";
import * as moment from "moment";
import * as _ from "lodash";

import { Dispatch, connect } from "react-redux";
import { apiRequest, ApiError } from "./ApiRequest";

export enum WeeklyLogType {
    BLOCK_COUNT = "BLOCK_COUNT",
    PARCEL_COUNT = "PARCEL_COUNT",
    TX_COUNT = "TX_COUNT"
}

interface OwnProps {
    type: WeeklyLogType;
    onData: (weeklyLog: Array<{
        x: string,
        y: string
    }>) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestWeeklyLogsInternal extends React.Component<Props> {
    public componentWillMount() {
        this.queryWeekLog();
    }

    public render() {
        return (null);
    }

    private queryWeekLog = async () => {
        const { onData, onError, dispatch, type } = this.props;
        let query = "";
        switch (type) {
            case WeeklyLogType.BLOCK_COUNT:
                query = "log/blockCount";
                break;
            case WeeklyLogType.PARCEL_COUNT:
                query = "log/parcelCount";
                break;
            case WeeklyLogType.TX_COUNT:
                query = "log/txCount";
                break;
        }
        try {
            const asyncJobs = _.map(_.reverse(_.range(7)), async (index) => {
                const momentObject = moment().utc().subtract(index, "days");
                const dateString = momentObject.format("YYYY-MM-DD");
                const resultDateString = momentObject.format("MM-DD");
                const count = await apiRequest({ path: `${query}?date=${dateString}`, dispatch, showProgressBar: true }) as string;
                return {
                    x: resultDateString,
                    y: count
                }
            });
            const results = await Promise.all(asyncJobs);
            onData(results);
        } catch (e) {
            onError(e)
        }
    }
}

const RequestWeeklyLogs = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestWeeklyLogsInternal);

export default RequestWeeklyLogs;
