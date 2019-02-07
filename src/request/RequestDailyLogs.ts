import * as _ from "lodash";
import * as React from "react";

import { connect, Dispatch } from "react-redux";
import { ApiError, apiRequest } from "./ApiRequest";

export enum DailyLogType {
    BEST_MINER = "BEST_MINER",
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

class RequestDailyLogs extends React.Component<Props> {
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
            const composeCount = (await apiRequest({
                path: `log/composeTxCount?date=${date}`,
                dispatch,
                showProgressBar: true
            })) as number;
            const decomposeCount = (await apiRequest({
                path: `log/decomposeTxCount?date=${date}`,
                dispatch,
                showProgressBar: true
            })) as number;
            const total = mintCount + transferCount + composeCount + decomposeCount;
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
                },
                {
                    id: `Compose (${((composeCount / total) * 100).toFixed(1)}%)`,
                    label: "Compose",
                    value: composeCount,
                    color: "hsl(53, 100%, 43%)"
                },
                {
                    id: `Decompose (${((decomposeCount / total) * 100).toFixed(1)}%)`,
                    label: "Decompose",
                    value: decomposeCount,
                    color: "hsl(86, 42%, 56%)"
                }
            ]);
        }
    };
}

export default connect()(RequestDailyLogs);
