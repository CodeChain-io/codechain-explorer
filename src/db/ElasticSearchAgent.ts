import { Client, SearchResponse, DeleteDocumentResponse } from "elasticsearch";
import { Block, H256, H160, SignedParcel } from "codechain-sdk/lib/core/classes";
import * as _ from "lodash";
import { BlockDoc, ParcelDoc, Type, AssetTransferTransactionDoc, AssetMintTransactionDoc, Converter, TransactionDoc, AssetDoc, AssetSchemeDoc, AssetBundleDoc, PendingParcelDoc, PendingTransactionDoc } from "./DocType";

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

    public getBlock = async (blockNumber: number): Promise<BlockDoc | null> => {
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
            if (response.hits.total === 0) {
                return null;
            }
            return response.hits.hits[0]._source;
        });
    }

    public getBlocks = async (): Promise<BlockDoc[]> => {
        return this.search({
            sort: [
                {
                    "number": { order: "desc" }
                }
            ],
            "size": 10000,
            query: {
                "bool": {
                    "must": [
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

    public getBlockByHash = async (hash: H256): Promise<BlockDoc | null> => {
        return this.search({
            "sort": [
                {
                    "number": { "order": "desc" }
                }
            ],
            "size": 10000,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "hash": hash.value } },
                        { "term": { "isRetracted": false } }
                    ]
                }
            }
        }).then((response: SearchResponse<BlockDoc>) => {
            if (response.hits.total === 0) {
                return null;
            }
            return response.hits.hits[0]._source;
        });
    }

    public getBlocksByAccountId = async (accountId: H160): Promise<BlockDoc[]> => {
        return this.search({
            "sort": [
                {
                    "number": { "order": "desc" }
                }
            ],
            "size": 10000,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "author": accountId.value } },
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

    public getParcel = async (hash: H256): Promise<ParcelDoc | null> => {
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

    public getParcels = async (): Promise<ParcelDoc[]> => {
        return await this.searchParcels({
            "match_all": {}
        });
    }

    public getTransaction = async (hash: H256): Promise<TransactionDoc | null> => {
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

    public getTransactions = async (): Promise<TransactionDoc[]> => {
        return await this.searchTransactions({
            "match_all": {}
        });
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

    public getAssetMintTransaction = async (assetType: H256): Promise<AssetMintTransactionDoc | null> => {
        const transactions = await this.searchTransactions({
            "bool": {
                "must": [
                    { "term": { "parcels.action.transactions.data.output.assetType": assetType.value } }
                ]
            }
        })
        if (transactions.length === 0) {
            return null;
        }
        return (transactions[0] as AssetMintTransactionDoc);
    }

    public getParcelsByAccountId = async (accountId: H160): Promise<ParcelDoc[]> => {
        const parcels = await this.searchParcels({
            "bool": {
                "should": [
                    { "term": { "parcels.sender": accountId.value } },
                    {
                        "nested": {
                            "path": "parcels.action",
                            "query": {
                                "bool": {
                                    "must": [
                                        { "term": { "parcels.action.receiver": accountId.value } }
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

    public getAssetBundlesByAccountId = async (accountId: H160): Promise<AssetBundleDoc[]> => {
        const transactions = await this.searchTransactions({
            "bool": {
                "must": [
                    { "term": { "parcels.action.transactions.data.registrar": accountId.value } }
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
                    assetType: tx.data.output.assetType,
                    lockScriptHash: tx.data.output.lockScriptHash,
                    parameters: tx.data.output.parameters,
                    amount: tx.data.output.amount || 0,
                    transactionHash: tx.data.hash,
                    transactionOutputIndex: 0
                }
            }
        });
    }

    public getTransactionsByPubKey = async (pubKey: H256): Promise<TransactionDoc[]> => {
        const transactions = await this.searchTransactions({
            "bool": {
                "should": [
                    {
                        "nested": {
                            "path": "parcels.action.transactions.data.outputs",
                            "query": {
                                "bool": {
                                    "must": [
                                        { "term": { "parcels.action.transactions.data.outputs.owner": pubKey.value } }
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
                                        { "term": { "parcels.action.transactions.data.inputs.owner": pubKey.value } }
                                    ]
                                }
                            }, "inner_hits": {}
                        }
                    },
                    { "term": { "parcels.action.transactions.data.output.owner": pubKey.value } }
                ]
            }
        });
        return transactions;
    }

    public getAssetsByPubKey = async (pubKey: H160): Promise<AssetDoc[]> => {
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
                                            "term": { "parcels.action.transactions.data.outputs.owner": pubKey.value }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    { "term": { "parcels.action.transactions.data.output.owner": pubKey.value } }
                ]
            }
        });
        return _.flatMap(transactions, transaction => {
            if (Type.isAssetTransferTransactionDoc(transaction)) {
                return _.chain((transaction as AssetTransferTransactionDoc).data.outputs)
                    .filter(output => output.owner === pubKey.value)
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
                const retAssetDoc: AssetDoc[] = [];
                const transactionDoc = (transaction as AssetMintTransactionDoc);
                if (transactionDoc.data.output.owner === pubKey.value) {
                    retAssetDoc.push({
                        assetType: transactionDoc.data.output.assetType,
                        lockScriptHash: transactionDoc.data.output.lockScriptHash,
                        parameters: transactionDoc.data.output.parameters,
                        amount: transactionDoc.data.output.amount || 0,
                        transactionHash: transactionDoc.data.hash,
                        transactionOutputIndex: 0
                    })
                }
                return retAssetDoc;
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

    public getAssetScheme = async (assetType: H256): Promise<AssetSchemeDoc | null> => {
        const transactions = await this.searchTransactions({
            "bool": {
                "must": [
                    { "term": { "parcels.action.transactions.data.output.assetType": assetType.value } }
                ]
            }
        });
        if (transactions.length === 0) {
            return null;
        }
        return Type.getAssetSchemeDoc(transactions[0] as AssetMintTransactionDoc);
    }

    public getCurrentPendingParcels = async (): Promise<PendingParcelDoc[]> => {
        const response = await this.searchPendinParcel({
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "status": "pending"
                            }
                        }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return [];
        }
        return _.map(response.hits.hits, hit => hit._source);
    }

    public getPendingParcel = async (hash: H256): Promise<PendingParcelDoc | null> => {
        const response = await this.searchPendinParcel({
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "parcel.hash": hash.value
                            }
                        }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return null;
        }
        return response.hits.hits[0]._source;
    }

    public getPendingTransaction = async (hash: H256): Promise<PendingTransactionDoc | null> => {
        const response = await this.searchPendinParcel({
            "query": {
                "bool": {
                    "must": [
                        {
                            "nested": {
                                "path": "parcel.action",
                                "query": {
                                    "nested": {
                                        "path": "parcel.action.transactions",
                                        "query": {
                                            "bool": {
                                                "must": [
                                                    {
                                                        "term": {
                                                            "parcel.action.transactions.data.hash": hash.value
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        "inner_hits": {}
                                    }
                                },
                                "inner_hits": {
                                    "_source": false
                                }
                            }
                        }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return null;
        }
        const transactionDocs = _.chain(response.hits.hits).flatMap(hit => hit.inner_hits["parcel.action"].hits.hits)
            .flatMap(hit => hit.inner_hits["parcel.action.transactions"].hits.hits)
            .map(hit => (hit._source as TransactionDoc))
            .value();
        return {
            timestamp: response.hits.hits[0]._source.timestamp,
            status: response.hits.hits[0]._source.status,
            transaction: transactionDocs[0]
        }
    }

    public getDeadPendingParcels = async (): Promise<PendingParcelDoc[]> => {
        const response = await this.searchPendinParcel({
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "status": "dead"
                            }
                        }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return [];
        }
        return _.map(response.hits.hits, hit => hit._source);
    }

    public checkIndexOrCreate = async (): Promise<void> => {
        const mappingBlockJson = require("./mapping_block.json");
        const mappingPendingParcelJson = require("./mapping_pending_parcel.json");
        const isMappingBlockExisted = await this.client.indices.exists({ index: "block" });
        const isMappingPendingParcelExisted = await this.client.indices.exists({ index: "pending_parcel" });
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
        if (!isMappingPendingParcelExisted) {
            await this.client.indices.create({
                index: "pending_parcel"
            });
            await this.client.indices.putMapping({
                index: "pending_parcel",
                type: "_doc",
                body: mappingPendingParcelJson
            });
        }
    }

    public addBlock = async (block: Block): Promise<void> => {
        return this.indexBlock(block);
    }

    public addPendingParcel = async (otherPendingParcels: SignedParcel[], pendingParcel: SignedParcel): Promise<void> => {
        return this.indexPendingParcel(otherPendingParcels, pendingParcel);
    }

    public deadPendingParcel = async (hash: H256): Promise<void> => {
        return this.client.update({
            index: "pending_parcel",
            type: "_doc",
            id: hash.value,
            refresh: "wait_for",
            body: {
                doc: {
                    "status": "dead"
                }
            }
        });
    }

    public removePendingParcel = async (hash: H256): Promise<DeleteDocumentResponse> => {
        return this.client.delete({
            index: "pending_parcel",
            type: "_doc",
            id: hash.value,
            refresh: "wait_for"
        });
    }

    public revialPendingParcel = async (hash: H256): Promise<void> => {
        return this.client.update({
            index: "pending_parcel",
            type: "_doc",
            id: hash.value,
            refresh: "wait_for",
            body: {
                doc: {
                    "status": "pending"
                }
            }
        });
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
            "size": 10000,
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
            "size": 10000,
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

    private searchPendinParcel = async (body: any): Promise<SearchResponse<any>> => {
        return this.client.search({
            index: "pending_parcel",
            type: "_doc",
            body
        })
    }

    private search = async (body: any): Promise<SearchResponse<any>> => {
        return this.client.search({
            index: "block",
            type: "_doc",
            body
        });
    }

    private indexPendingParcel = async (otherPendingParcels: SignedParcel[], pendingParcel: SignedParcel): Promise<any> => {
        const pendingParcelDoc: PendingParcelDoc = await Converter.fromPendingParcel(otherPendingParcels, pendingParcel, this);
        return this.client.index({
            index: "pending_parcel",
            type: "_doc",
            id: pendingParcel.hash().value,
            body: pendingParcelDoc,
            refresh: "wait_for"
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
