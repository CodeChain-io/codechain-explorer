import { Client, SearchResponse } from "elasticsearch";
import { Block, SignedParcel, H256, H160, Transaction, Asset, AssetScheme, AssetMintTransaction } from "codechain-sdk/lib/core/classes";
import { getTransactionFromJSON } from "codechain-sdk/lib/core/transaction/Transaction";
import * as _ from "lodash";
import { BlockDoc, ParcelDoc, Type, AssetTransferTransactionDoc, AssetMintTransactionDoc, Converter, TransactionDoc, AssetDoc, AssetSchemeDoc, AssetBundleDoc } from "../db/DocType";

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
            "sort": [
                {
                    "number": { "order": "desc" }
                }
            ],
            "size": 1,
            "query": {
                "bool": {
                    "must": {
                        "term": {
                            "isRetracted": false
                        }
                    }
                }
            }
        }).then((response: SearchResponse<BlockDoc>) => {
            if (response.hits.total === 0) {
                return -1;
            }
            return response.hits.hits[0]._source.number;
        });
    }

    public getBlock = async (blockNumber: number): Promise<BlockDoc> => {
        return this.search({
            sort: [
                {
                    "number": { order: "desc" }
                }
            ],
            query: {
                "bool": {
                    "must": [
                        { "term": { "number": blockNumber } },
                        { "term": { "isRetracted": false } }
                    ]
                }
            }
        }).then((response: SearchResponse<BlockDoc>) => {
            return response.hits.hits[0]._source;
        });
    }

    public getBlockByHash = async (hash: H256): Promise<BlockDoc> => {
        return this.search({
            "sort": [
                {
                    "number": { "order": "desc" }
                }
            ],
            "query": {
                "bool": {
                    "must": [
                        { "term": { "hash": hash.value } },
                        { "term": { "isRetracted": false } }
                    ]
                }
            }
        }).then((response: SearchResponse<BlockDoc>) => {
            return response.hits.hits[0]._source;
        });
    }

    public getBlocksByPlatformAddress = async (address: H160): Promise<BlockDoc[]> => {
        return this.search({
            "sort": [
                {
                    "number": { "order": "desc" }
                }
            ],
            "query": {
                "bool": {
                    "must": [
                        { "term": { "author": address.value } },
                        { "term": { "isRetracted": false } }
                    ]
                }
            }
        }).then((response: SearchResponse<BlockDoc>) => {
            if (response.hits.total === 0) {
                return [];
            }
            return _.map(response.hits.hits, hit => hit._source);
        });
    }

    public getParcel = async (hash: H256): Promise<ParcelDoc> => {
        const parcels = await this.searchParcels({
            "bool": {
                "must": [
                    { "term": { "parcels.hash": hash.value } }
                ]
            }
        });
        if (parcels.length === 0) {
            return null;
        }
        return parcels[0];
    }

    public getTransaction = async (hash: H256): Promise<TransactionDoc> => {
        const transactions = await this.searchTransactions({
            "bool": {
                "must": [
                    { "term": { "parcels.action.transactions.data.hash": hash.value } }
                ]
            }
        });

        if (transactions.length === 0) {
            return null;
        }
        return transactions[0];
    }

    public getAssetTransferTransactions = async (assetType: H256): Promise<AssetTransferTransactionDoc[]> => {
        const transactions = await this.searchTransactions({
            "nested": {
                "path": "parcels.action.transactions.data.outputs",
                "query": {
                    "bool": {
                        "must": [
                            { "term": { "parcels.action.transactions.data.outputs.assetType": assetType.value } }
                        ]
                    }
                }, "inner_hits": {}
            }
        });
        return _.map(transactions, (tx) => (tx as AssetTransferTransactionDoc));
    }

    public getAssetMintTransaction = async (assetType: H256): Promise<AssetMintTransactionDoc> => {
        const transactions = await this.searchTransactions({
            "bool": {
                "must": [
                    { "term": { "parcels.action.transactions.data.assetType": assetType.value } }
                ]
            }
        })
        if (transactions.length === 0) {
            return null;
        }
        return (transactions[0] as AssetMintTransactionDoc);
    }

    public getParcelsByPlatformAddress = async (address: H160): Promise<ParcelDoc[]> => {
        const parcels = await this.searchParcels({
            "bool": {
                "should": [
                    { "term": { "parcels.sender": address.value } },
                    {
                        "nested": {
                            "path": "parcels.action",
                            "query": {
                                "bool": {
                                    "must": [
                                        { "term": { "parcels.action.receiver": address.value } }
                                    ]
                                }
                            },
                            "inner_hits": {}
                        }
                    }
                ]
            }
        });
        if (parcels.length === 0) {
            return [];
        }
        return parcels;
    }

    public getAssetBundlesByPlatformAddress = async (address: H160): Promise<AssetBundleDoc[]> => {
        const transactions = await this.searchTransactions({
            "bool": {
                "must": [
                    { "term": { "parcels.action.transactions.data.registrar": address.value } }
                ]
            }
        });
        if (transactions.length === 0) {
            return [];
        }
        return _.map(transactions, (tx: AssetMintTransactionDoc) => {
            const assetScheme = Type.getAssetSchemeDoc(tx);
            return {
                assetScheme,
                asset: {
                    assetType: tx.data.assetType,
                    lockScriptHash: tx.data.lockScriptHash,
                    parameters: tx.data.parameters,
                    amount: tx.data.amount,
                    transactionHash: tx.data.hash,
                    transactionOutputIndex: 0
                }
            }
        });
    }

    public getTransactionsByAddress = async (address: H256): Promise<TransactionDoc[]> => {
        const transactions = await this.searchTransactions({
            "bool": {
                "should": [
                    {
                        "nested": {
                            "path": "parcels.action.transactions.data.outputs",
                            "query": {
                                "bool": {
                                    "must": [
                                        { "term": { "parcels.action.transactions.data.outputs.owner": address.value } }
                                    ]
                                }
                            }, "inner_hits": {}
                        }
                    },
                    {
                        "nested": {
                            "path": "parcels.action.transactions.data.inputs",
                            "query": {
                                "bool": {
                                    "must": [
                                        { "term": { "parcels.action.transactions.data.inputs.owner": address.value } }
                                    ]
                                }
                            }, "inner_hits": {}
                        }
                    },
                    { "term": { "parcels.action.transactions.data.owner": address.value } }
                ]
            }
        });
        return transactions;
    }

    public getAssetsByAssetAddress = async (address: H160): Promise<AssetDoc[]> => {
        const transactions = await this.searchTransactions({
            "bool": {
                "should": [
                    {
                        "nested": {
                            "path": "parcels.action.transactions.data.outputs",
                            "query": {
                                "bool": {
                                    "must": [
                                        {
                                            "term": { "parcels.action.transactions.data.outputs.owner": address.value }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    { "term": { "parcels.action.transactions.data.owner": address.value } }
                ]
            }
        });
        return _.flatMap(transactions, transaction => {
            if (Type.isAssetTransferTransactionDoc(transaction)) {
                return _.chain((transaction as AssetTransferTransactionDoc).data.outputs)
                    .filter(output => output.owner === address.value)
                    .map((output, index) => {
                        return {
                            assetType: output.assetType,
                            lockScriptHash: output.lockScriptHash,
                            parameters: output.parameters,
                            amount: output.amount,
                            transactionHash: transaction.data.hash,
                            transactionOutputIndex: index
                        }
                    }).value();
            } else if (Type.isAssetMintTransactionDoc(transaction)) {
                const transactionDoc = (transaction as AssetMintTransactionDoc);
                if (transactionDoc.data.owner === address.value) {
                    return {
                        assetType: transactionDoc.data.assetType,
                        lockScriptHash: transactionDoc.data.lockScriptHash,
                        parameters: transactionDoc.data.parameters,
                        amount: transactionDoc.data.amount,
                        transactionHash: transactionDoc.data.hash,
                        transactionOutputIndex: 0
                    };
                }
                return [];
            }
            throw new Error("Unexpected transaction")
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

    public getAssetScheme = async (assetType: H256): Promise<AssetSchemeDoc> => {
        const transactions = await this.searchTransactions({
            "bool": {
                "must": [
                    { "term": { "parcels.action.transactions.data.assetType": assetType.value } }
                ]
            }
        });
        if (transactions.length === 0) {
            return null;
        }
        return Type.getAssetSchemeDoc(transactions[0] as AssetMintTransactionDoc);
    }

    public checkIndexOrCreate = async (): Promise<void> => {
        const mappingBlockJson = require("./mapping_block.json");
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

    public addBlock = async (block: Block): Promise<void> => {
        return this.indexBlock(block);
    }

    public retractBlock = async (blockHash: H256): Promise<void> => {
        return this.updateBlock(blockHash, { "isRetracted": true }).then(() => {
            console.log("%s block is retracted", blockHash.value);
        });
    }

    private searchParcels = async (query: any): Promise<ParcelDoc[]> => {
        const response = await this.search({
            "sort": [
                {
                    "number": { "order": "desc" }
                }
            ],
            "_source": false,
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "isRetracted": false
                            }
                        },
                        {
                            "nested": {
                                "path": "parcels",
                                "query": query,
                                "inner_hits": {}
                            }
                        }
                    ]
                }
            }
        })
        if (response.hits.total === 0) {
            return [];
        }
        return _.chain(response.hits.hits).flatMap(hit => hit.inner_hits.parcels.hits.hits)
            .map(hit => (hit._source as ParcelDoc))
            .value();
    }

    private searchTransactions = async (query: any): Promise<TransactionDoc[]> => {
        const response = await this.search({
            "sort": [
                {
                    "number": { "order": "desc" }
                }
            ],
            "_source": false,
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "isRetracted": false
                            }
                        },
                        {
                            "nested": {
                                "path": "parcels",
                                "query": {
                                    "nested": {
                                        "path": "parcels.action",
                                        "query": {
                                            "nested": {
                                                "path": "parcels.action.transactions",
                                                "query": query,
                                                "inner_hits": {}
                                            }
                                        },
                                        "inner_hits": { "_source": false }
                                    }
                                },
                                "inner_hits": { "_source": false }
                            }
                        }
                    ]
                }
            }
        })
        if (response.hits.total === 0) {
            return [];
        }
        return _.chain(response.hits.hits).flatMap(hit => hit.inner_hits.parcels.hits.hits)
            .flatMap(hit => hit.inner_hits["parcels.action"].hits.hits)
            .flatMap(hit => hit.inner_hits["parcels.action.transactions"].hits.hits)
            .map(hit => (hit._source as TransactionDoc))
            .value();
    }

    private search = async (body: any): Promise<SearchResponse<any>> => {
        return this.client.search({
            index: "block",
            type: "_doc",
            body
        });
    }

    private indexBlock = async (block: Block): Promise<any> => {
        const blockDoc: BlockDoc = await Converter.fromBlock(block, this);
        return this.client.index({
            index: "block",
            type: "_doc",
            id: block.hash.value,
            body: blockDoc,
            refresh: "wait_for"
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
        });
    }
}
