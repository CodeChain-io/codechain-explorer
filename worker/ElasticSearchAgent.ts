import * as _ from "lodash";
import { Client, SearchResponse } from "elasticsearch";
import { Block, H256, AssetMintTransaction, ChangeShardState } from "codechain-sdk/lib/core/classes";

export class ElasticSearchAgent {
    private client: Client;
    constructor(host: string) {
        this.client = new Client({
            host
        });
    }

    public checkIndexOrCreate = async (): Promise<void> => {
        const mappingBlockJson = require("./elasticsearch/mapping_block.json");
        const mappingAssetMintTransactionJson = require("./elasticsearch/mapping_asset_mint_transaction.json");
        const isMappingBlockExisted = await this.client.indices.exists({ index: "block" });
        const isMappingAssetMintTransactionExisted = await this.client.indices.exists({ index: "asset_mint_transaction" });
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
        if (!isMappingAssetMintTransactionExisted) {
            await this.client.indices.create({
                index: "asset_mint_transaction"
            });
            await this.client.indices.putMapping({
                index: "asset_mint_transaction",
                type: "_doc",
                body: mappingAssetMintTransactionJson
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
        }).then((response: SearchResponse<any>) => {
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
        }).then((response: SearchResponse<any>) => {
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
        }).then((response: SearchResponse<any>) => {
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
        const block = await this.getBlockByHash(blockHash);
        _.each(block.parcels, (parcel) => {
            if (parcel.unsigned.action instanceof ChangeShardState) {
                _.each(parcel.unsigned.action.transactions, async (transaction) => {
                    if (transaction instanceof AssetMintTransaction) {
                        await this.updateAssetScheme(blockHash, { "isRetracted": true });
                    }
                });
            }
        });

        return this.updateBlock(blockHash, { "isRetracted": true }).then(() => {
            console.log("%s block is retracted", blockHash.value);
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
        const blockDoc: any = block.toJSON();
        blockDoc.isRetracted = false;
        _.each(block.parcels, (parcel) => {
            if (parcel.unsigned.action instanceof ChangeShardState) {
                _.each(parcel.unsigned.action.transactions, async (transaction) => {
                    if (transaction instanceof AssetMintTransaction) {
                        try {
                            const transactionDoc: any = transaction.toJSON();
                            transactionDoc.isRetracted = false;
                            await this.client.index({
                                index: "asset_mint_transaction",
                                type: "_doc",
                                id: transaction.getAssetSchemeAddress().value,
                                body: transactionDoc,
                                refresh: "wait_for"
                            })
                        } catch (e) {
                            console.error('Elastic search index error %s', e);
                        }
                    }
                });
            }
        });

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

    private updateAssetScheme(assetType: H256, partial: any): Promise<any> {
        return this.client.update({
            index: "asset_mint_transaction",
            type: "_doc",
            id: assetType.value,
            refresh: "wait_for",
            body: {
                doc: partial
            }
        }).catch((err) => {
            console.error('Elastic search update error %s', err);
        });
    }
}
