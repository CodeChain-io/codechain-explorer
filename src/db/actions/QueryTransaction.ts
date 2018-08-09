import * as _ from "lodash";
import { H256, H160, Transaction, SignedParcel } from "codechain-sdk/lib/core/classes";
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

    public async getAssetTransferTransactions(assetType: H256): Promise<AssetTransferTransactionDoc[]> {
        const response = await this.searchTransaction({
            "sort": [
                { "data.blockNumber": { "order": "desc" } },
                { "data.parcelIndex": { "order": "desc" } },
                { "data.transactionIndex": { "order": "desc" } }
            ],
            "size": 10000,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        { "term": { "data.outputs.assetType": assetType.value } }
                    ]
                }
            }
        });
        return _.map(response.hits.hits, hit => hit._source);
    }

    public async getAssetMintTransaction(assetType: H256): Promise<AssetMintTransactionDoc | null> {
        const response = await this.searchTransaction({
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
        return response.hits.hits[0]._source;
    }

    public async getTransactionsByPubKey(pubKey: H256): Promise<TransactionDoc[]> {
        const response = await this.searchTransaction({
            "sort": [
                { "data.blockNumber": { "order": "desc" } },
                { "data.parcelIndex": { "order": "desc" } },
                { "data.transactionIndex": { "order": "desc" } }
            ],
            "size": 10000,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        {
                            "bool": {
                                "should": [
                                    { "term": { "data.outputs.owner": pubKey.value } },
                                    { "term": { "data.inputs.owner": pubKey.value } },
                                    { "term": { "data.output.owner": pubKey.value } }
                                ]
                            }
                        }
                    ]
                }
            }
        });
        return _.map(response.hits.hits, hit => hit._source);
    }

    public async getAssetBundlesByAccountId(accountId: H160): Promise<AssetBundleDoc[]> {
        const response = await this.searchTransaction({
            "sort": [
                { "data.blockNumber": { "order": "desc" } },
                { "data.parcelIndex": { "order": "desc" } },
                { "data.transactionIndex": { "order": "desc" } }
            ],
            "size": 10000,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        { "term": { "data.registrar": accountId.value } }
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

    public async getAssetsByPubKey(pubKey: H160): Promise<AssetDoc[]> {
        const response = await this.searchTransaction({
            "sort": [
                { "data.blockNumber": { "order": "desc" } },
                { "data.parcelIndex": { "order": "desc" } },
                { "data.transactionIndex": { "order": "desc" } }
            ],
            "size": 10000,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "isRetracted": false } },
                        {
                            "bool": {
                                "should": [
                                    { "term": { "data.outputs.owner": pubKey.value } },
                                    { "term": { "data.output.owner": pubKey.value } }
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
        return response.hits.hits[0]._source;
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
