import { Client, SearchResponse } from "elasticsearch";
import { Block, H256, Transaction, ChangeShardState } from "codechain-sdk/lib/core/classes";
import { BlockDoc, Converter } from "../type/DocType";
import * as _ from "lodash";

export class ElasticSearchAgent {
    private client: Client;
    constructor(host: string) {
        this.client = new Client({
            host
        });
    }

    public checkIndexOrCreate = async (): Promise<void> => {
        const mappingBlockJson = require("./elasticsearch/mapping_block.json");
        const isMappingBlockExisted = await this.client.indices.exists({ index: "block" });
        if (!isMappingBlockExisted) {
            await this.client.indices.create({
                index: "block"
            });
            await this.client.indices.putMapping({
                index: "block",
                type: "_doc",
                body: mappingBlockJson
            });
        }
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
        }).then((response: SearchResponse<BlockDoc>) => {
            if (response.hits.total === 0) {
                return -1;
            }
            return response.hits.hits[0]._source.number;
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
        }).then((response: SearchResponse<BlockDoc>) => {
            if (response.hits.total === 0) {
                return null;
            }
            return Block.fromJSON(response.hits.hits[0]._source);
        });
    }

    public getBlockByHash = async (blockHash: H256): Promise<Block> => {
        return this.search({
            query: {
                "bool": {
                    "must": [
                        { "match": { "_id": blockHash.value } },
                        { "match": { "isRetracted": false } }
                    ]
                }
            }
        }).then((response: SearchResponse<BlockDoc>) => {
            if (response.hits.total === 0) {
                return null;
            }
            return Block.fromJSON(response.hits.hits[0]._source);
        });
    }

    public addBlock = async (block: Block): Promise<void> => {
        return this.index(block);
    }

    public retractBlock = async (blockHash: H256): Promise<void> => {
        return this.updateBlock(blockHash, { "isRetracted": true }).then(() => {
            console.log("%s block is retracted", blockHash.value);
        });
    }

    public getTransaction = async (hash: H256): Promise<Transaction> => {
        return this.searchBlock({
            query: {
                "bool": {
                    "must": [
                        { "term": { "parcels.action.transactions.data.hash": hash.value } }
                    ],
                    "filter": {
                        "term": {
                            "isRetracted": false
                        }
                    }
                }
            }
        }).then((response: SearchResponse<BlockDoc>) => {
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

    private search(body: any): Promise<void | SearchResponse<any>> {
        return this.client.search({
            index: "block",
            type: "_doc",
            body
        }).catch((err) => {
            console.error('Elastic search error %s', err);
        });
    }

    private index = async (block: Block): Promise<any> => {
        const blockDoc: BlockDoc = await Converter.fromBlock(block, this);
        return this.client.index({
            index: "block",
            type: "_doc",
            id: block.hash.value,
            body: blockDoc,
            refresh: "wait_for"
        }).catch((err) => {
            console.error('Elastic search index error %s', err);
        });
    }

    private updateBlock(hash: H256, partial: any): Promise<any> {
        return this.client.update({
            index: "block",
            type: "_doc",
            id: hash.value,
            refresh: "wait_for",
            body: {
                doc: partial
            }
        }).catch((err) => {
            console.error('Elastic search update error %s', err);
        });
    }

    private searchBlock(body: any): Promise<void | SearchResponse<any>> {
        return this.client.search({
            index: "block",
            type: "_doc",
            body
        }).catch((err) => {
            console.error('Elastic search error %s', err);
        });
    }
}
