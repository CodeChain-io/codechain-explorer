import { getMappingBlock } from "../mappings/mapping_block";
import { getMappingParcel } from "../mappings/mapping_parcel";
import { getMappingTransaction } from "../mappings/mapping_transaction";
import { getMappingPendingParcel } from "../mappings/mapping_pending_parcel";
import { BaseAction } from "./BaseAction";
import { ElasticSearchAgent } from "../ElasticSearchAgent";
import { Client } from "elasticsearch";
import { getMappingLog } from "../mappings/mapping_log";

export class QueryIndex implements BaseAction {
    public agent: ElasticSearchAgent;
    public client: Client;

    public async checkIndexOrCreate(): Promise<void> {
        const isMappingBlockExisted = await this.client.indices.exists({ index: "block" });
        const isMappingParcelExisted = await this.client.indices.exists({ index: "parcel" });
        const isMappingTransactionExisted = await this.client.indices.exists({ index: "transaction" });
        const isMappingPendingParcelExisted = await this.client.indices.exists({ index: "pending_parcel" });
        const isMappingLogExisted = await this.client.indices.exists({ index: "log" });
        if (!isMappingBlockExisted) {
            await this.client.indices.create({
                index: "block"
            });
            await this.client.indices.putMapping({
                index: "block",
                type: "_doc",
                body: getMappingBlock()
            });
        }
        if (!isMappingParcelExisted) {
            await this.client.indices.create({
                index: "parcel"
            });
            await this.client.indices.putMapping({
                index: "parcel",
                type: "_doc",
                body: getMappingParcel()
            });
        }
        if (!isMappingTransactionExisted) {
            await this.client.indices.create({
                index: "transaction"
            });
            await this.client.indices.putMapping({
                index: "transaction",
                type: "_doc",
                body: getMappingTransaction()
            });
        }
        if (!isMappingPendingParcelExisted) {
            await this.client.indices.create({
                index: "pending_parcel"
            });
            await this.client.indices.putMapping({
                index: "pending_parcel",
                type: "_doc",
                body: getMappingPendingParcel()
            });
        }
        if (!isMappingLogExisted) {
            await this.client.indices.create({
                index: "log"
            });
            await this.client.indices.putMapping({
                index: "log",
                type: "_doc",
                body: getMappingLog()
            });
        }
    }
}
