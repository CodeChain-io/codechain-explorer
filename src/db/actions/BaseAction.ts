import { Client } from "elasticsearch";
import { ElasticSearchAgent } from "../ElasticSearchAgent";

export class BaseAction {
    public agent: ElasticSearchAgent;
    public client: Client;
}
