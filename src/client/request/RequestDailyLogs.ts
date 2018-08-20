import * as React from "react";
import * as _ from "lodash";

import { Dispatch, connect } from "react-redux";
import { apiRequest, ApiError } from "./ApiRequest";

export enum DailyLogType {
    BEST_MINER = "BEST_MINER",
    PARCEL_ACTION = "PARCEL_ACTION",
    TX_TYPE = "TX_TYPE"
}

interface OwnProps {
    date: string;
    type: DailyLogType;
    onData: (dailyLogs: Array<{
        id: string,
        label: string,
        value: number,
        color: string
    }>) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

interface MinerLog {
    date: string,
    count: number,
    value: string
}

type Props = OwnProps & DispatchProps;

class RequestDailyLogsInternal extends React.Component<Props> {
    public componentWillMount() {
        try {
            this.queryDailyLog();
        } catch (e) {
            this.props.onError(e);
        }
    }

    public render() {
        return (null);
    }

    private getColor = (index: number) => {
        const colorSet = ["hsl(163, 100%, 50%)", "hsl(235, 100%, 50%)", "hsl(328, 100%, 50%)", "hsl(53, 100%, 50%)", "hsl(114, 100%, 50%)"];
        return colorSet[index];
    }

    private queryDailyLog = async () => {
        const { onData, dispatch, type, date } = this.props;

        if (type === DailyLogType.BEST_MINER) {
            const bestMineres = await apiRequest({ path: `log/bestMiners?date=${date}`, dispatch, showProgressBar: true }) as MinerLog[];
            const results = _.map(bestMineres, (bestMiner, index) => {
                return {
                    id: `${bestMiner.value.slice(0, 10)}...`,
                    label: `${bestMiner.value.slice(0, 10)}...`,
                    value: bestMiner.count,
                    color: this.getColor(index)
                }
            })
            onData(results);
        } else if (type === DailyLogType.PARCEL_ACTION) {
            const paymentParcelCount = await apiRequest({ path: `log/paymentCount?date=${date}`, dispatch, showProgressBar: true }) as number;
            const changeShardStateScount = await apiRequest({ path: `log/changeShardStateCount?date=${date}`, dispatch, showProgressBar: true }) as number;
            const setRegularKeyCount = await apiRequest({ path: `log/setRegularKeyCount?date=${date}`, dispatch, showProgressBar: true }) as number;
            onData([
                {
                    id: "Payment",
                    label: "Payment",
                    value: paymentParcelCount,
                    color: "hsl(36, 86%, 62%)"
                },
                {
                    id: "ChangeShardState",
                    label: "ChangeShardState",
                    value: changeShardStateScount,
                    color: "hsl(90, 100%, 42%)"
                },
                {
                    id: "SetRegularKey",
                    label: "SetRegularKey",
                    value: setRegularKeyCount,
                    color: "hsl(11, 100%, 71%)"
                }
            ])
        } else if (type === DailyLogType.TX_TYPE) {
            const transferCount = await apiRequest({ path: `log/transferTxCount?date=${date}`, dispatch, showProgressBar: true }) as number;
            const mintCount = await apiRequest({ path: `log/mintTxCount?date=${date}`, dispatch, showProgressBar: true }) as number;
            onData([
                {
                    id: "Transfer",
                    label: "Transfer",
                    value: transferCount,
                    color: "hsl(263, 100%, 43%)"
                },
                {
                    id: "Mint",
                    label: "Mint",
                    value: mintCount,
                    color: "hsl(169, 100%, 43%)"
                }
            ])
        }
    }
}

const RequestDailyLogs = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestDailyLogsInternal);

export default RequestDailyLogs;
