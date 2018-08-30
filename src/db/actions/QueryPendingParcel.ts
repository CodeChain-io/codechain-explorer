import { H256 } from "codechain-sdk/lib/core/classes";
import { Client, CountResponse, DeleteDocumentResponse, SearchResponse } from "elasticsearch";
import * as _ from "lodash";
import {
    AssetMintTransactionDoc,
    AssetSchemeDoc,
    ChangeShardStateDoc,
    PendingParcelDoc,
    PendingTransactionDoc,
    TransactionDoc,
    Type
} from "../DocType";
import { ElasticSearchAgent } from "../ElasticSearchAgent";
import { BaseAction } from "./BaseAction";

export class QueryPendingParcel implements BaseAction {
    public agent: ElasticSearchAgent;
    public client: Client;

    public async getAllOfCurrentPendingParcels(): Promise<PendingParcelDoc[]> {
        const response = await this.searchPendinParcel({
            size: 10000,
            query: {
                bool: {
                    must: [{ term: { status: "pending" } }]
                }
            }
        });
        if (response.hits.total === 0) {
            return [];
        }
        return _.map(response.hits.hits, hit => hit._source);
    }

    public async getCurrentPendingParcels(
        page: number = 1,
        itemsPerPage: number = 25,
        actionFilters: string[] = [],
        signerFilter: string,
        sorting: string = "pendingPeriod",
        orderBy: string = "desc"
    ): Promise<PendingParcelDoc[]> {
        let sortQuery;
        switch (sorting) {
            case "pendingPeriod":
                sortQuery = [{ timestamp: { order: orderBy } }];
                break;
            case "txs":
                sortQuery = [{ "parcel.countOfTransaction": { order: orderBy } }, { timestamp: { order: "desc" } }];
                break;
            case "fee":
                sortQuery = [{ "parcel.fee": { order: orderBy } }, { timestamp: { order: "desc" } }];
                break;
        }
        let query;
        if (signerFilter) {
            query = [
                { term: { status: "pending" } },
                { terms: { "parcel.action.action": actionFilters } },
                { term: { "parcel.sender": signerFilter } }
            ];
        } else {
            query = [{ term: { status: "pending" } }, { terms: { "parcel.action.action": actionFilters } }];
        }
        const response = await this.searchPendinParcel({
            sort: sortQuery,
            from: (page - 1) * itemsPerPage,
            size: itemsPerPage,
            query: {
                bool: {
                    must: query
                }
            }
        });
        if (response.hits.total === 0) {
            return [];
        }
        return _.map(response.hits.hits, hit => hit._source);
    }

    public async getTotalPendingParcelCount(actionFilters: string[], signerFilter?: string): Promise<number> {
        let query;
        if (signerFilter) {
            query = [
                { term: { status: "pending" } },
                { terms: { "parcel.action.action": actionFilters } },
                { term: { "parcel.sender": signerFilter } }
            ];
        } else {
            query = [{ term: { status: "pending" } }, { terms: { "parcel.action.action": actionFilters } }];
        }
        const count = await this.countPendingParcel({
            query: {
                bool: {
                    must: query
                }
            }
        });
        return count.count;
    }

    public async getPendingParcel(hash: H256): Promise<PendingParcelDoc | null> {
        const response = await this.searchPendinParcel({
            size: 1,
            query: {
                bool: {
                    must: [
                        {
                            term: { "parcel.hash": hash.value }
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

    public async getPendingTransaction(hash: H256): Promise<PendingTransactionDoc | null> {
        const response = await this.searchPendinParcel({
            size: 1,
            query: {
                bool: {
                    must: [
                        {
                            term: {
                                "parcel.action.transactions.data.hash": hash.value
                            }
                        }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return null;
        }
        const transactionDoc = _.chain(response.hits.hits)
            .flatMap(hit => hit._source as PendingParcelDoc)
            .map(PendingParcel => PendingParcel.parcel)
            .filter(parcel => Type.isChangeShardStateDoc(parcel.action))
            .flatMap(parcel => (parcel.action as ChangeShardStateDoc).transactions)
            .filter((transaction: TransactionDoc) => transaction.data.hash === hash.value)
            .value();
        return {
            timestamp: response.hits.hits[0]._source.timestamp,
            status: response.hits.hits[0]._source.status,
            transaction: transactionDoc[0]
        };
    }

    public async getPendingAssetScheme(assetType: H256): Promise<AssetSchemeDoc | null> {
        const response = await this.searchPendinParcel({
            size: 1,
            query: {
                bool: {
                    must: [
                        { term: { status: "pending" } },
                        {
                            term: {
                                "parcel.action.transactions.data.output.assetType": assetType.value
                            }
                        }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return null;
        }
        const transactionDoc = _.chain(response.hits.hits)
            .flatMap(hit => hit._source as PendingParcelDoc)
            .map(PendingParcel => PendingParcel.parcel)
            .filter(parcel => Type.isChangeShardStateDoc(parcel.action))
            .flatMap(parcel => (parcel.action as ChangeShardStateDoc).transactions)
            .filter(transaction => Type.isAssetMintTransactionDoc(transaction))
            .filter((transaction: AssetMintTransactionDoc) => transaction.data.output.assetType === assetType.value)
            .value();
        return Type.getAssetSchemeDoc(transactionDoc[0] as AssetMintTransactionDoc);
    }

    public async getDeadPendingParcels(): Promise<PendingParcelDoc[]> {
        const response = await this.searchPendinParcel({
            query: {
                bool: {
                    must: [{ term: { status: "dead" } }]
                }
            }
        });
        if (response.hits.total === 0) {
            return [];
        }
        return _.map(response.hits.hits, hit => hit._source);
    }

    public async searchPendinParcel(body: any): Promise<SearchResponse<any>> {
        return this.client.search({
            index: "pending_parcel",
            type: "_doc",
            body
        });
    }

    public async deadPendingParcel(hash: H256): Promise<void> {
        return this.client.update({
            index: "pending_parcel",
            type: "_doc",
            id: hash.value,
            refresh: "wait_for",
            body: {
                doc: {
                    status: "dead"
                }
            }
        });
    }

    public async removePendingParcel(hash: H256): Promise<DeleteDocumentResponse> {
        return this.client.delete({
            index: "pending_parcel",
            type: "_doc",
            id: hash.value,
            refresh: "wait_for"
        });
    }

    public async indexPendingParcel(pendingParcelDoc: PendingParcelDoc): Promise<any> {
        return this.client.index({
            index: "pending_parcel",
            type: "_doc",
            id: pendingParcelDoc.parcel.hash,
            body: pendingParcelDoc,
            refresh: "wait_for"
        });
    }

    public async revialPendingParcel(hash: H256): Promise<void> {
        return this.client.update({
            index: "pending_parcel",
            type: "_doc",
            id: hash.value,
            refresh: "wait_for",
            body: {
                doc: {
                    status: "pending"
                }
            }
        });
    }

    public async countPendingParcel(body: any): Promise<CountResponse> {
        return this.client.count({
            index: "pending_parcel",
            type: "_doc",
            body
        });
    }
}
