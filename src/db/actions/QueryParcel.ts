import { H256 } from "codechain-sdk/lib/core/classes";
import { Client, CountResponse, SearchResponse } from "elasticsearch";
import * as _ from "lodash";
import { ParcelDoc } from "../DocType";
import { ElasticSearchAgent } from "../ElasticSearchAgent";
import { BaseAction } from "./BaseAction";

export class QueryParcel implements BaseAction {
    public agent: ElasticSearchAgent;
    public client: Client;
    public async getParcel(hash: H256): Promise<ParcelDoc | null> {
        const response = await this.searchParcel({
            sort: [{ blockNumber: { order: "desc" } }, { parcelIndex: { order: "desc" } }],
            size: 1,
            query: {
                bool: {
                    must: [{ term: { isRetracted: false } }, { term: { hash: hash.value } }]
                }
            }
        });
        if (response.hits.total === 0) {
            return null;
        }
        return response.hits.hits[0]._source;
    }

    public async getParcels(page: number = 1, itemsPerPage: number = 25): Promise<ParcelDoc[]> {
        const response = await this.searchParcel({
            sort: [{ blockNumber: { order: "desc" } }, { parcelIndex: { order: "desc" } }],
            from: (page - 1) * itemsPerPage,
            size: itemsPerPage,
            query: {
                bool: {
                    must: [{ term: { isRetracted: false } }]
                }
            }
        });
        return _.map(response.hits.hits, hit => hit._source);
    }

    public async getTotalParcelCount(): Promise<number> {
        const count = await this.countParcel({
            query: {
                term: { isRetracted: false }
            }
        });
        return count.count;
    }

    public async getParcelsByPlatformAddress(
        address: string,
        page: number = 1,
        itemsPerPage: number = 6
    ): Promise<ParcelDoc[]> {
        const response = await this.searchParcel({
            sort: [{ blockNumber: { order: "desc" } }, { parcelIndex: { order: "desc" } }],
            from: (page - 1) * itemsPerPage,
            size: itemsPerPage,
            query: {
                bool: {
                    must: [
                        { term: { isRetracted: false } },
                        {
                            bool: {
                                should: [{ term: { sender: address } }, { term: { "action.receiver": address } }]
                            }
                        }
                    ]
                }
            }
        });
        return _.map(response.hits.hits, hit => hit._source);
    }

    public async getTotalParcelCountByPlatformAddress(address: string): Promise<number> {
        const count = await this.countParcel({
            query: {
                bool: {
                    must: [
                        { term: { isRetracted: false } },
                        {
                            bool: {
                                should: [{ term: { sender: address } }, { term: { "action.receiver": address } }]
                            }
                        }
                    ]
                }
            }
        });
        return count.count;
    }

    public async searchParcel(body: any): Promise<SearchResponse<any>> {
        return this.client.search({
            index: "parcel",
            type: "_doc",
            body
        });
    }

    public async retractParcel(parcelHash: H256): Promise<void> {
        return this.updateParcel(parcelHash, { isRetracted: true });
    }

    public async indexParcel(parcelDoc: ParcelDoc): Promise<any> {
        return this.client.index({
            index: "parcel",
            type: "_doc",
            id: parcelDoc.hash,
            body: parcelDoc,
            refresh: "true"
        });
    }

    public async updateParcel(hash: H256, partial: any): Promise<any> {
        return this.client.update({
            index: "parcel",
            type: "_doc",
            id: hash.value,
            refresh: "true",
            body: {
                doc: partial
            }
        });
    }

    public async countParcel(body: any): Promise<CountResponse> {
        return this.client.count({
            index: "parcel",
            type: "_doc",
            body
        });
    }
}
