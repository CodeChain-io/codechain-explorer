import * as _ from "lodash";
import * as React from "react";

import { connect, Dispatch } from "react-redux";
import { ApiError, apiRequest } from "./ApiRequest";

export enum DailyLogType {
    BEST_MINER = "BEST_MINER",
    PARCEL_ACTION = "PARCEL_ACTION",
    TX_TYPE = "TX_TYPE"
}

interface OwnProps {
    date: string;
    type: DailyLogType;
    onData: (
        dailyLogs: Array<{
            id: string;
            label: string;
            value: number;
            color: string;
            minerAddress?: string;
        }>
    ) => void;
    onEmptyResult: () => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

interface MinerLog {
    date: string;
    count: number;
    value: string;
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
        return null;
    }

    private getColor = (index: number) => {
        const colorSet = [
            "hsl(238, 100%, 73%)",
            "hsl(237, 100%, 78%)",
            "hsl(238, 100%, 85%)",
            "hsl(238, 100%, 89%)",
            "hsl(238, 100%, 94%)"
        ];
        return colorSet[index];
    };

    private queryDailyLog = async () => {
        const { onData, dispatch, type, date, onEmptyResult } = this.props;

        if (type === DailyLogType.BEST_MINER) {
            const bestMineres = (await apiRequest({
                path: `log/bestMiners?date=${date}`,
                dispatch,
                showProgressBar: true
            })) as MinerLog[];
            if (bestMineres.length === 0) {
                onEmptyResult();
                return;
            }
            const total = _.sumBy(bestMineres, miner => miner.count);
            const results = _.map(bestMineres, (bestMiner, index) => {
                return {
                    id: `${bestMiner.value.slice(0, 7)}... (${((bestMiner.count / total) * 100).toFixed(1)}%)`,
                    label: `${bestMiner.value.slice(0, 7)}...`,
                    value: bestMiner.count,
                    color: this.getColor(index),
                    minerAddress: bestMiner.value
                };
            });
            onData(results);
        } else if (type === DailyLogType.PARCEL_ACTION) {
            const paymentParcelCount = (await apiRequest({
                path: `log/paymentCount?date=${date}`,
                dispatch,
                showProgressBar: true
            })) as number;
            const assetTransactionGroupScount = (await apiRequest({
                path: `log/assetTransactionGroupCount?date=${date}`,
                dispatch,
                showProgressBar: true
            })) as number;
            const setRegularKeyCount = (await apiRequest({
                path: `log/setRegularKeyCount?date=${date}`,
                dispatch,
                showProgressBar: true
            })) as number;
            const total = paymentParcelCount + assetTransactionGroupScount + setRegularKeyCount;
            if (total === 0) {
                onEmptyResult();
                return;
            }
            onData([
                {
                    id: `Payment (${((paymentParcelCount / total) * 100).toFixed(1)}%)`,
                    label: "Payment",
                    value: paymentParcelCount,
                    color: "hsl(36, 86%, 62%)"
                },
                {
                    id: `AssetTransactionGroup (${((assetTransactionGroupScount / total) * 100).toFixed(1)}%)`,
                    label: "AssetTransactionGroup",
                    value: assetTransactionGroupScount,
                    color: "hsl(90, 100%, 42%)"
                },
                {
                    id: `SetRegularKey (${((setRegularKeyCount / total) * 100).toFixed(1)}%)`,
                    label: "SetRegularKey",
                    value: setRegularKeyCount,
                    color: "hsl(11, 100%, 71%)"
                }
            ]);
        } else if (type === DailyLogType.TX_TYPE) {
            const transferCount = (await apiRequest({
                path: `log/transferTxCount?date=${date}`,
                dispatch,
                showProgressBar: true
            })) as number;
            const mintCount = (await apiRequest({
                path: `log/mintTxCount?date=${date}`,
                dispatch,
                showProgressBar: true
            })) as number;
            const total = mintCount + transferCount;
            if (total === 0) {
                onEmptyResult();
                return;
            }
            onData([
                {
                    id: `Transfer (${((transferCount / total) * 100).toFixed(1)}%)`,
                    label: "Transfer",
                    value: transferCount,
                    color: "hsl(263, 83%, 68%)"
                },
                {
                    id: `Mint (${((mintCount / total) * 100).toFixed(1)}%)`,
                    label: "Mint",
                    value: mintCount,
                    color: "hsl(169, 100%, 43%)"
                }
            ]);
        }
    };
}

const RequestDailyLogs = connect(
    null,
    (dispatch: Dispatch) => {
        return { dispatch };
    }
)(RequestDailyLogsInternal);

export default RequestDailyLogs;
