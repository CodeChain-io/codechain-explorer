import * as _ from "lodash";
import { SearchResponse, Client } from "elasticsearch";
import { BaseAction } from "./BaseAction";
import { ElasticSearchAgent } from "../ElasticSearchAgent";

export interface LogData {
    date: string,
    count: number,
    type: LogType,
    value: string
}

export enum LogType {
    BLOCK_COUNT = "BLOCK_COUNT",
    BLOCK_MINING_COUNT = "BLOCK_MINING_COUNT",
    PARCEL_COUNT = "PARCEL_COUNT",
    TX_COUNT = "TX_COUNT",
    PARCEL_PAYMENT_COUNT = "PARCEL_PAYMENT_COUNT",
    PARCEL_SET_REGULAR_KEY_COUNT = "PARCEL_SET_REGULAR_KEY_COUNT",
    PARCEL_CHANGE_SHARD_STATE_COUNT = "PARCEL_CHANGE_SHARD_STATE_COUNT",
    TX_ASSET_MINT_COUNT = "TX_ASSET_MINT_COUNT",
    TX_ASSET_TRANSFER_COUNT = "TX_ASSET_TRANSFER_COUNT"
}

export class QueryLog implements BaseAction {
    public agent: ElasticSearchAgent;
    public client: Client;

    public async increaseLogCount(date: string, logType: LogType, count: number, value?: string): Promise<void> {
        if (count === 0) {
            return;
        }
        const log = await this.getLog(date, logType, value);
        if (log) {
            await this.updateLog(log, {
                count: log.count + count
            });
        } else {
            await this.indexLog(date, logType, value);
        }
    }

    public async decreaseLogCount(date: string, logType: LogType, count: number, value?: string): Promise<void> {
        if (count === 0) {
            return;
        }
        const log = await this.getLog(date, logType, value);
        if (log) {
            await this.updateLog(log, {
                count: log.count - count
            });
        } else {
            throw new Error("Invalid decreasing log action");
        }
    }

    public async getLogCount(date: string, logType: LogType): Promise<number> {
        const log = await this.getLog(date, logType);
        if (!log) {
            return 0;
        }
        return log.count;
    }

    public async getBestMiners(date: string): Promise<LogData[]> {
        const response = await this.searchLog({
            "sort": [
                {
                    "count": { "order": "desc" }
                }
            ],
            "size": 5,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "date": date } },
                        { "term": { "type": "BLOCK_MINING_COUNT" } }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return [];
        }
        return _.map(response.hits.hits, hit => hit._source);
    }

    public async searchLog(body: any): Promise<SearchResponse<any>> {
        return this.client.search({
            "index": "log",
            "type": "_doc",
            body
        })
    }

    public async indexLog(date: string, logType: LogType, value?: string): Promise<any> {
        return this.client.index({
            "index": "log",
            "type": "_doc",
            "id": `${date}_${logType}_${value || "N"}`,
            "body": {
                "date": date,
                "count": 1,
                "type": logType,
                "value": value
            },
            "refresh": "wait_for"
        });
    }

    public async updateLog(logData: LogData, doc: any): Promise<void> {
        return this.client.update({
            "index": "log",
            "type": "_doc",
            "id": `${logData.date}_${logData.type}_${logData.value || "N"}`,
            "body": {
                doc
            },
            "refresh": "wait_for"
        });
    }

    public async getLog(date: string, logType: LogType, value?: string): Promise<LogData | null> {
        const response = await this.client.search<LogData>({
            "index": "log",
            "type": "_doc",
            "body": {
                "size": 1,
                "query": {
                    "term": {
                        "_id": `${date}_${logType}_${value || "N"}`
                    }
                }
            }
        });
        if (response.hits.total === 0) {
            return null;
        }
        return response.hits.hits[0]._source;
    }
}
