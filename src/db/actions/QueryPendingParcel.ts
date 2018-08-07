import * as _ from "lodash";
import { PendingParcelDoc, PendingTransactionDoc, TransactionDoc, Converter, Type, ChangeShardStateDoc } from "../DocType";
import { H256, SignedParcel } from "codechain-sdk/lib/core/classes";
import { SearchResponse, Client, DeleteDocumentResponse } from "elasticsearch";
import { BaseAction } from "./BaseAction";
import { ElasticSearchAgent } from "../ElasticSearchAgent";

export class QueryPendingParcel implements BaseAction {
    public agent: ElasticSearchAgent;
    public client: Client;

    public async getCurrentPendingParcels(page: number = 1, itemsPerPage: number = 5): Promise<PendingParcelDoc[]> {
        const response = await this.searchPendinParcel({
            "sort": [
                { "timestamp": { "order": "desc" } }
            ],
            "from": (page - 1) * itemsPerPage,
            "size": itemsPerPage,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "status": "pending" } }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return [];
        }
        return _.map(response.hits.hits, hit => hit._source);
    }

    public async getPendingParcel(hash: H256): Promise<PendingParcelDoc | null> {
        const response = await this.searchPendinParcel({
            "size": 1,
            "query": {
                "bool": {
                    "must": [
                        {
                            "term": { "parcel.hash": hash.value }
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
            "size": 1,
            "query": {
                "bool": {
                    "must": [
                        { "term": { "parcel.action.transactions.data.hash": hash.value } }
                    ]
                }
            }
        });
        if (response.hits.total === 0) {
            return null;
        }
        const transactionDoc = _.chain(response.hits.hits).flatMap(hit => (hit._source as PendingParcelDoc))
            .map(PendingParcel => PendingParcel.parcel)
            .filter(parcel => Type.isChangeShardStateDoc(parcel.action))
            .flatMap(parcel => (parcel.action as ChangeShardStateDoc).transactions)
            .filter((transaction: TransactionDoc) => transaction.data.hash === hash.value)
            .value()
        return {
            timestamp: response.hits.hits[0]._source.timestamp,
            status: response.hits.hits[0]._source.status,
            transaction: transactionDoc[0]
        }
    }

    public async getDeadPendingParcels(): Promise<PendingParcelDoc[]> {
        const response = await this.searchPendinParcel({
            "query": {
                "bool": {
                    "must": [
                        { "term": { "status": "dead" } }
                    ]
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
        })
    }

    public async deadPendingParcel(hash: H256): Promise<void> {
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

    public async removePendingParcel(hash: H256): Promise<DeleteDocumentResponse> {
        return this.client.delete({
            index: "pending_parcel",
            type: "_doc",
            id: hash.value,
            refresh: "wait_for"
        });
    }

    public async indexPendingParcel(otherPendingParcels: SignedParcel[], pendingParcel: SignedParcel): Promise<any> {
        const pendingParcelDoc: PendingParcelDoc = await Converter.fromPendingParcel(otherPendingParcels, pendingParcel, this.agent);
        return this.client.index({
            index: "pending_parcel",
            type: "_doc",
            id: pendingParcel.hash().value,
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
                    "status": "pending"
                }
            }
        });
    }
}
