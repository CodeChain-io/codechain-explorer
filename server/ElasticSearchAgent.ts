import { Client, SearchResponse } from "elasticsearch";
import { Block, SignedParcel, H256, H160, Transaction, SDK, ChangeShardState } from "codechain-sdk";
import * as _ from "lodash";

export class ElasticSearchAgent {
    private client: Client;
    constructor(host: string) {
        this.client = new Client({
            host
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
            if (response.hits.total === 0) {
                return -1;
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

    public getParcel = async (hash: H256): Promise<SignedParcel> => {
        return this.search({
            query: {
                "bool": {
                    "must": [
                        { "match": { "parcels.hash": hash.value } },
                        { "match": { "isRetracted": false } }
                    ]
                }
            }
        }).then((response: SearchResponse<any>) => {
            if (response.hits.total === 0) {
                return null;
            }
            const findBlock = Block.fromJSON(response.hits.hits[0]._source);
            const parcelData = _.filter(findBlock.parcels, (parcel) => {
                return parcel.hash().value === hash.value;
            });
            return parcelData[0];
        });
    }

    public getTransaction = async (hash: H256): Promise<Transaction> => {
        return this.search({
            query: {
                "bool": {
                    "must": [
                        { "match": { "parcels.action.transactions.data.hash": hash.value } },
                        { "match": { "isRetracted": false } }
                    ]
                }
            }
        }).then((response: SearchResponse<any>) => {
            if (response.hits.total === 0) {
                return null;
            }
            const findBlock = Block.fromJSON(response.hits.hits[0]._source);
            let transactionData: Transaction;
            _.each(findBlock.parcels, (parcel) => {
                if (parcel.unsigned.action instanceof ChangeShardState) {
                    _.each(parcel.unsigned.action.transactions, (transaction: Transaction) => {
                        if (transaction.hash().value === hash.value) {
                            transactionData = transaction;
                        }
                    });
                }
            })
            return transactionData;
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

    private search(body: any): Promise<void | SearchResponse<any>> {
        return this.client.search({
            index: "block",
            type: "_doc",
            body
        }).catch((err) => {
            console.error('Elastic search error %s', err);
        });
    }
}
