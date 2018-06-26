import { Client, SearchResponse } from "elasticsearch";
import { Block, H256 } from "codechain-sdk";

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

    private index(block: Block): Promise<any> {
        let blockDoc: any = block.toJSON();
        blockDoc.isRetracted = false;
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

    private update(hash: H256, partial: any): Promise<any> {
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
        }).then((response: SearchResponse<any>) => {
            if (response.hits.total == 0) {
                return 0;
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
            return Block.fromJSON(response.hits.hits[0]._source);
        });
    }

    public addBlock = async (block: Block): Promise<void> => {
        return this.index(block).then((doc: any) => {
            console.log("%s block is indexed", doc._id);
        });
    }

    public retractBlock = async (blockHash: H256): Promise<void> => {
        return this.update(blockHash, { "isRetracted": true }).then(() => {
            console.log("%s block is retracted", blockHash.value);
        });
    }
}
