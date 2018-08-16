import * as _ from "lodash";
import { H256, Transaction, SignedParcel } from "codechain-sdk/lib/core/classes";
import { TransactionDoc, AssetTransferTransactionDoc, AssetMintTransactionDoc, AssetBundleDoc, Type, AssetDoc, AssetSchemeDoc, Converter } from "../DocType";
import { BaseAction } from "./BaseAction";
import { Client, SearchResponse, CountResponse } from "elasticsearch";
import { ElasticSearchAgent } from "../ElasticSearchAgent";

export class QueryTransaction implements BaseAction {
    public agent: ElasticSearchAgent;
    public client: Client;

    public async getTransaction(hash: H256): Promise<TransactionDoc | null> {
        const response = await this.searchTransaction({
            "query": {
                "bool": {
                    "must": [
                        { "term": { "data.hash": hash.value } },
                        { "term": { "isRetracted": false } }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return null;
        }
        return response.hits.hits[0]._source;
    }

    public async getTransactions(page: number = 1, itemsPerPage: number = 5): Promise<TransactionDoc[]> {
        const response = await this.searchTransaction({
            "sort": [
                { "data.blockNumber": { "order": "desc" } },
                { "data.parcelIndex": { "order": "desc" } },
                { "data.transactionIndex": { "order": "desc" } }
            ],
            "from": (page - 1) * itemsPerPage,
            "size": itemsPerPage,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } }
                    ]
                }
            }
        });
        return _.map(response.hits.hits, hit => hit._source);
    }

    public async getTotalTransactionCount(): Promise<number> {
        const count = await this.countTransaction({
            "query": {
                "term": { "isRetracted": false }
            }
        });
        return count.count;
    }

    public async getTransactionsByAssetType(assetType: H256, page: number = 1, itemsPerPage: number = 3): Promise<TransactionDoc[]> {
        const response = await this.searchTransaction({
            "sort": [
                { "data.blockNumber": { "order": "desc" } },
                { "data.parcelIndex": { "order": "desc" } },
                { "data.transactionIndex": { "order": "desc" } }
            ],
            "from": (page - 1) * itemsPerPage,
            "size": itemsPerPage,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        {
                            "bool": {
                                "should": [
                                    { "term": { "data.outputs.assetType": assetType.value } },
                                    { "term": { "data.output.assetType": assetType.value } }
                                ]
                            }
                        }
                    ]
                }
            }
        });
        return _.map(response.hits.hits, hit => hit._source);
    }

    public async getTotalTransactionCountByAssetType(assetType: H256): Promise<number> {
        const count = await this.countTransaction({
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        {
                            "bool": {
                                "should": [
                                    { "term": { "data.outputs.assetType": assetType.value } },
                                    { "term": { "data.output.assetType": assetType.value } }
                                ]
                            }
                        }
                    ]
                }
            }
        });
        return count.count;
    }

    public async getTransactionsByAssetTransferAddress(address: string, page: number = 1, itemsPerPage: number = 3): Promise<TransactionDoc[]> {
        const response = await this.searchTransaction({
            "sort": [
                { "data.blockNumber": { "order": "desc" } },
                { "data.parcelIndex": { "order": "desc" } },
                { "data.transactionIndex": { "order": "desc" } }
            ],
            "from": (page - 1) * itemsPerPage,
            "size": itemsPerPage,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        {
                            "bool": {
                                "should": [
                                    { "term": { "data.outputs.owner": address } },
                                    { "term": { "data.inputs.owner": address } },
                                    { "term": { "data.output.owner": address } }
                                ]
                            }
                        }
                    ]
                }
            }
        });
        return _.map(response.hits.hits, hit => hit._source);
    }

    public async getTotalTxCountByAssetTransferAddress(address: string): Promise<number> {
        const count = await this.countTransaction({
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        {
                            "bool": {
                                "should": [
                                    { "term": { "data.outputs.owner": address } },
                                    { "term": { "data.inputs.owner": address } },
                                    { "term": { "data.output.owner": address } }
                                ]
                            }
                        }
                    ]
                }
            }
        });
        return count.count;
    }

    public async getAssetBundlesByPlatformAddress(address: string, page: number = 1, itemsPerPage: number = 3): Promise<AssetBundleDoc[]> {
        const response = await this.searchTransaction({
            "sort": [
                { "data.blockNumber": { "order": "desc" } },
                { "data.parcelIndex": { "order": "desc" } },
                { "data.transactionIndex": { "order": "desc" } }
            ],
            "from": (page - 1) * itemsPerPage,
            "size": itemsPerPage,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        { "term": { "data.registrar": address } }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return [];
        }
        return _.map(response.hits.hits, (hit) => {
            const tx = hit._source;
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

    public async getTotalAssetBundleCountByPlatformAddress(address: string): Promise<number> {
        const count = await this.countTransaction({
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        { "term": { "data.registrar": address } }
                    ]
                }
            }
        });
        return count.count;
    }

    public async getAssetsByAssetTransferAddress(address: string, lastBlockNumber: number = Number.MAX_VALUE, lastParcelIndex: number = Number.MAX_VALUE, lastTransactionIndex: number = Number.MAX_VALUE, itemsPerPage: number = 3): Promise<AssetDoc[]> {
        const response = await this.searchTransaction({
            "sort": [
                { "data.blockNumber": { "order": "desc" } },
                { "data.parcelIndex": { "order": "desc" } },
                { "data.transactionIndex": { "order": "desc" } }
            ],
            "search_after": [lastBlockNumber, lastParcelIndex, lastTransactionIndex],
            "size": itemsPerPage,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        {
                            "bool": {
                                "should": [
                                    { "term": { "data.outputs.owner": address } },
                                    { "term": { "data.output.owner": address } }
                                ]
                            }
                        }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return [];
        }
        return _.flatMap(response.hits.hits, hit => {
            const transaction = hit._source;
            if (Type.isAssetTransferTransactionDoc(transaction)) {
                return _.chain((transaction as AssetTransferTransactionDoc).data.outputs)
                    .filter(output => output.owner === address)
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
                if (transactionDoc.data.output.owner === address) {
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

    public async getAssetScheme(assetType: H256): Promise<AssetSchemeDoc | null> {
        const response = await this.searchTransaction({
            "sort": [
                { "data.blockNumber": { "order": "desc" } },
                { "data.parcelIndex": { "order": "desc" } },
                { "data.transactionIndex": { "order": "desc" } }
            ],
            "size": 1,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        { "term": { "data.output.assetType": assetType.value } }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return null;
        }
        return Type.getAssetSchemeDoc(response.hits.hits[0]._source);
    }

    public async getAssetBundlesByAssetName(name: string): Promise<AssetBundleDoc[]> {
        const response = await this.searchTransaction({
            "sort": [
                { "data.blockNumber": { "order": "desc" } },
                { "data.parcelIndex": { "order": "desc" } },
                { "data.transactionIndex": { "order": "desc" } }
            ],
            "size": 10,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        { "match": { "data.assetName": { "query": name, "fuzziness": 3 } } }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return [];
        }
        return _.map(response.hits.hits, (hit) => {
            const tx = hit._source;
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

    public async searchTransaction(body: any): Promise<SearchResponse<any>> {
        return this.client.search({
            index: "transaction",
            type: "_doc",
            body
        });
    }

    public async retractTransaction(transactionHash: H256): Promise<void> {
        return this.updateTransaction(transactionHash, { "isRetracted": true });
    }

    public async indexTransaction(currentTransactions: Transaction[], transaction: Transaction, timestamp: number, parcel: SignedParcel, transactionIndex: number): Promise<any> {
        const transactionDoc: TransactionDoc = await Converter.fromTransaction(currentTransactions, transaction, this.agent, timestamp, parcel, transactionIndex);
        return this.client.index({
            index: "transaction",
            type: "_doc",
            id: transaction.hash().value,
            body: transactionDoc,
            refresh: "wait_for"
        });
    }

    public async updateTransaction(hash: H256, partial: any): Promise<any> {
        return this.client.update({
            index: "transaction",
            type: "_doc",
            id: hash.value,
            refresh: "wait_for",
            body: {
                doc: partial
            }
        });
    }

    public async countTransaction(body: any): Promise<CountResponse> {
        return this.client.count({
            index: "transaction",
            type: "_doc",
            body
        });
    }
}
