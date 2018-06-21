import { Client, SearchResponse } from "elasticsearch";
import { BlockDoc, BlockDocValue } from "./elasticsearch/docType";

export class ElasticSearchAgent {
    private client: Client;
    constructor(host: string) {
        this.client = new Client({
            host: host
        });
    }

    private search(body: any): Promise<void | SearchResponse<any>> {
        return this.client.search({
            index: "block",
            type: "_doc",
            body: body
        }).catch((err) => {
            console.error('Elastic search error %s', err);
        });
    }

    private index(body: BlockDoc): Promise<any> {
        return this.client.index({
            index: "block",
            type: "_doc",
            id: body.hash,
            body: body,
            refresh: "wait_for"
        }).catch((err) => {
            console.error('Elastic search index error %s', err);
        });
    }

    private update(id: string, partial: any): Promise<any> {
        return this.client.update({
            index: "block",
            type: "_doc",
            id: id,
            refresh: "wait_for",
            body: {
                doc: partial
            }
        }).catch((err) => {
            console.error('Elastic search update error %s', err);
        });
    }

    public checkIndexOrCreate = async (): Promise<void> => {
        let mappingJson = require("./elasticsearch/mapping.json");
        let isIndexExisted = await this.client.indices.exists({ index: "block" });
        if (!isIndexExisted) {
            await this.client.indices.create({
                index: "block"
            });
            await this.client.indices.putMapping({
                index: "block",
                type: "_doc",
                body: mappingJson
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
        }).then((response: SearchResponse<BlockDocValue>) => {
            if (response.hits.total == 0) {
                return 0;
            }
            return response.hits.hits[0]._source.number;
        });
    }

    public getBlock = async (blockNumber: number): Promise<BlockDoc> => {
        return this.search({
            query: {
                "bool": {
                    "must": [
                        { "match": { "number": blockNumber } },
                        { "match": { "isRetracted": false } }
                    ]
                }
            }
        }).then((response: SearchResponse<BlockDocValue>) => {
            return new BlockDoc(response.hits.hits[0]._source);
        });
    }

    public addBlock = async (blockDoc: BlockDoc): Promise<void> => {
        return this.index(blockDoc).then((doc: any) => {
            console.log("%s block is indexed", doc._id);
        });
    }

    public retractBlock = async (blockHash: string): Promise<void> => {
        return this.update(blockHash, { "isRetracted": true }).then(() => {
            console.log("%s block is retracted", blockHash);
        });
    }
}
