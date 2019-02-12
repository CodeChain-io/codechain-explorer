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
    dailyBlockTotal: number;
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
    count: number;
    address: string;
}

type Props = OwnProps & DispatchProps;

const colorSet = [
    "hsl(191, 100%, 41%)",
    "hsl(206, 75%, 42%)",
    "hsl(223, 45%, 64%)",
    "hsl(239, 34%, 47%)",
    "hsl(271, 40%, 40%)",
    "hsl(289, 33%, 45%)",
    "hsl(308, 34%, 55%)",
    "hsl(326, 57%, 68%)",
    "hsl(42, 91% 74%)",
    "hsl(55, 94% 74%)",
    "hsl(80, 55% 70%)",
    "hsl(122, 36% 59%)",
    "hsl(170, 42% 69%)"
];

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
        return colorSet[index];
    };

    private queryDailyLog = async () => {
        const { onData, dispatch, type, date, onEmptyResult, dailyBlockTotal } = this.props;

        if (type === DailyLogType.BEST_MINER) {
            const bestMiners = (await apiRequest({
                path: `log/miners?date=${date}`,
                dispatch,
                showProgressBar: true
            })) as MinerLog[];
            if (bestMiners.length === 0) {
                onEmptyResult();
                return;
            }
            const minerTotal = _.sumBy(bestMiners, miner => miner.count);
            const results = _.map(bestMiners, (bestMiner, index) => {
                return {
                    id: `${bestMiner.address.slice(0, 7)}... (${((bestMiner.count / dailyBlockTotal) * 100).toFixed(
                        1
                    )}%)`,
                    label: `${bestMiner.address.slice(0, 7)}...`,
                    value: bestMiner.count,
                    color: this.getColor(index + 1),
                    minerAddress: bestMiner.address
                };
            });
            const remainTotal = dailyBlockTotal - minerTotal;
            results.push({
                id: `others (${((remainTotal / dailyBlockTotal) * 100).toFixed(1)}%)`,
                label: `others`,
                value: remainTotal,
                color: this.getColor(0),
                minerAddress: ""
            });
            onData(results);
        } else if (type === DailyLogType.TX_TYPE) {
            const mintCount = (await apiRequest({
                path: `log/count?date=${date}&filter=mintAsset`,
                dispatch,
                showProgressBar: true
            })) as number;
            const transferCount = (await apiRequest({
                path: `log/count?date=${date}&filter=transferAsset`,
                dispatch,
                showProgressBar: true
            })) as number;
            const composeCount = (await apiRequest({
                path: `log/count?date=${date}&filter=composeAsset`,
                dispatch,
                showProgressBar: true
            })) as number;
            const decomposeCount = (await apiRequest({
                path: `log/count?date=${date}&filter=decomposeAsset`,
                dispatch,
                showProgressBar: true
            })) as number;
            const payCount = (await apiRequest({
                path: `log/count?date=${date}&filter=pay`,
                dispatch,
                showProgressBar: true
            })) as number;
            const createShardCount = (await apiRequest({
                path: `log/count?date=${date}&filter=createShard`,
                dispatch,
                showProgressBar: true
            })) as number;
            const setRegularKeyCount = (await apiRequest({
                path: `log/count?date=${date}&filter=setRegularKey`,
                dispatch,
                showProgressBar: true
            })) as number;
            const logTotal =
                mintCount +
                transferCount +
                composeCount +
                decomposeCount +
                payCount +
                createShardCount +
                setRegularKeyCount;
            if (logTotal === 0) {
                onEmptyResult();
                return;
            }
            onData([
                {
                    id: `Transfer (${((transferCount / logTotal) * 100).toFixed(1)}%)`,
                    label: "Transfer",
                    value: transferCount,
                    color: colorSet[0]
                },
                {
                    id: `Mint (${((mintCount / logTotal) * 100).toFixed(1)}%)`,
                    label: "Mint",
                    value: mintCount,
                    color: colorSet[1]
                },
                {
                    id: `Compose (${((composeCount / logTotal) * 100).toFixed(1)}%)`,
                    label: "Compose",
                    value: composeCount,
                    color: colorSet[2]
                },
                {
                    id: `Decompose (${((decomposeCount / logTotal) * 100).toFixed(1)}%)`,
                    label: "Decompose",
                    value: decomposeCount,
                    color: colorSet[3]
                },
                {
                    id: `Pay (${((payCount / logTotal) * 100).toFixed(1)}%)`,
                    label: "Pay",
                    value: payCount,
                    color: colorSet[4]
                },
                {
                    id: `CreateShard (${((createShardCount / logTotal) * 100).toFixed(1)}%)`,
                    label: "CreateShard",
                    value: createShardCount,
                    color: colorSet[5]
                },
                {
                    id: `setRegularKey (${((setRegularKeyCount / logTotal) * 100).toFixed(1)}%)`,
                    label: "setRegularKey",
                    value: setRegularKeyCount,
                    color: colorSet[6]
                }
            ]);
        }
    };
}

export default connect()(RequestDailyLogs);
