import { H256 } from "codechain-sdk/lib/core/classes";
import { Client, CountResponse, SearchResponse } from "elasticsearch";
import * as _ from "lodash";
import { BlockDoc } from "../DocType";
import { ElasticSearchAgent } from "../ElasticSearchAgent";
import { BaseAction } from "./BaseAction";

export class QueryBlock implements BaseAction {
    public agent: ElasticSearchAgent;
    public client: Client;

    public async getLastBlockNumber(): Promise<number> {
        return this.searchBlock({
            sort: [
                {
                    number: { order: "desc" }
                }
            ],
            size: 1,
            query: {
                bool: {
                    must: {
                        term: {
                            isRetracted: false
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

    public async getBlock(blockNumber: number): Promise<BlockDoc | null> {
        return this.searchBlock({
            sort: [
                {
                    number: { order: "desc" }
                }
            ],
            size: 1,
            query: {
                bool: {
                    must: [{ term: { number: blockNumber } }, { term: { isRetracted: false } }]
                }
            }
        }).then((response: SearchResponse<BlockDoc>) => {
            if (response.hits.total === 0) {
                return null;
            }
            return response.hits.hits[0]._source;
        });
    }

    public async getBlockByHash(hash: H256): Promise<BlockDoc | null> {
        return this.searchBlock({
            sort: [
                {
                    number: { order: "desc" }
                }
            ],
            size: 1,
            query: {
                bool: {
                    must: [{ term: { hash: hash.value } }, { term: { isRetracted: false } }]
                }
            }
        }).then((response: SearchResponse<BlockDoc>) => {
            if (response.hits.total === 0) {
                return null;
            }
            return response.hits.hits[0]._source;
        });
    }

    public async getBlocks(page: number = 1, itemsPerPage: number = 25): Promise<BlockDoc[]> {
        return this.searchBlock({
            sort: [
                {
                    number: { order: "desc" }
                }
            ],
            from: (page - 1) * itemsPerPage,
            size: itemsPerPage,
            query: {
                bool: {
                    must: [{ term: { isRetracted: false } }]
                }
            }
        }).then((response: SearchResponse<BlockDoc>) => {
            if (response.hits.total === 0) {
                return [];
            }
            return _.map(response.hits.hits, hit => hit._source);
        });
    }

    public async getTotalBlockCount(): Promise<number> {
        const count = await this.countBlock({
            query: {
                term: { isRetracted: false }
            }
        });
        return count.count;
    }

    public async getBlocksByPlatformAddress(
        address: string,
        page: number = 1,
        itemsPerPage: number = 6
    ): Promise<BlockDoc[]> {
        return this.searchBlock({
            sort: [
                {
                    number: { order: "desc" }
                }
            ],
            from: (page - 1) * itemsPerPage,
            size: itemsPerPage,
            query: {
                bool: {
                    must: [{ term: { author: address } }, { term: { isRetracted: false } }]
                }
            }
        }).then((response: SearchResponse<BlockDoc>) => {
            if (response.hits.total === 0) {
                return [];
            }
            return _.map(response.hits.hits, hit => hit._source);
        });
    }

    public async getTotalBlockCountByPlatformAddress(address: string): Promise<number> {
        const count = await this.countBlock({
            query: {
                bool: {
                    must: [{ term: { author: address } }, { term: { isRetracted: false } }]
                }
            }
        });
        return count.count;
    }

    public async retractBlock(blockHash: H256): Promise<void> {
        return this.updateBlock(blockHash, { isRetracted: true });
    }

    public async indexBlock(blockDoc: BlockDoc): Promise<any> {
        return this.client.index({
            index: "block",
            type: "_doc",
            id: blockDoc.hash,
            body: blockDoc,
            refresh: "wait_for"
        });
    }

    public async updateBlock(hash: H256, partial: any): Promise<any> {
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

    public async searchBlock(body: any): Promise<SearchResponse<any>> {
        return this.client.search({
            index: "block",
            type: "_doc",
            body
        });
    }

    public async countBlock(body: any): Promise<CountResponse> {
        return this.client.count({
            index: "block",
            type: "_doc",
            body
        });
    }
}
