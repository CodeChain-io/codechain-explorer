import { Client, SearchResponse } from "elasticsearch";
import { Block, Parcel, H256, H160 } from "codechain-sdk";
import * as _ from "lodash";

export class ElasticSearchAgent {
    private client: Client;
    constructor(host: string) {
        this.client = new Client({
            host: host
        });
    }

    private search(body: any): Promise<void | SearchResponse<any>> {
        return this.client.search({
            index: "block",
            type: "_doc",
            body: body
        }).catch((err) => {
            console.error('Elastic search error %s', err);
        });
    }

    public ping = async (): Promise<string> => {
        return this.client.ping({ requestTimeout: 30000 }).then((data) => {
            return 'pong';
        });
    }

    public getLastBlockNumber = async (): Promise<number> => {
        return this.search({
            sort: [
                {
                    "number": { order: "desc" }
                }
            ],
            size: 1,
            query: {
                "bool": {
                    "must": [
                        { "match": { "isRetracted": false } }
                    ]
                }
            }
        }).then((response: SearchResponse<any>) => {
            if (response.hits.total == 0) {
                return 0;
            }
            return response.hits.hits[0]._source.number;
        });
    }

    public getBlockByHash = async (hash: H256): Promise<Block> => {
        return this.search({
            query: {
                "bool": {
                    "must": [
                        { "match": { "hash": hash.value } },
                        { "match": { "isRetracted": false } }
                    ]
                }
            }
        }).then((response: SearchResponse<any>) => {
            return Block.fromJSON(response.hits.hits[0]._source);
        });
    }

    public getParcel = async (hash: H256): Promise<Parcel> => {
        return this.search({
            _source: "parcels.*",
            query: {
                "bool": {
                    "must": [
                        { "match": { "parcel.hash": hash.value } },
                        { "match": { "isRetracted": false } }
                    ]
                }
            }
        }).then((response: SearchResponse<any>) => {
            if (response.hits.total == 0) {
                return null;
            }
            const parcelData = _.filter(response.hits.hits[0]._source.parcels, (data) => {
                return data.hash === hash.value;
            });
            return Parcel.fromJSON(parcelData);
        });
    }

    public getBlock = async (blockNumber: number): Promise<Block> => {
        return this.search({
            query: {
                "bool": {
                    "must": [
                        { "match": { "number": blockNumber } },
                        { "match": { "isRetracted": false } }
                    ]
                }
            }
        }).then((response: SearchResponse<any>) => {
            return Block.fromJSON(response.hits.hits[0]._source);
        });
    }

    public getTransactionInvoice = async (blockHash: H256): Promise<any> => {
        // TODO
        return null;
    }

    public getNonce = async (address: H160): Promise<any> => {
        // TODO
        return null;
    }

    public getBalance = async (address: H160): Promise<any> => {
        // TODO
        return null;
    }

    public getAssetScheme = async (txHash: H256): Promise<any> => {
        // TODO
        return null;
    }
}
