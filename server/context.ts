import { ServerConfig } from "./";
import { ElasticSearchAgent } from "./db";
import { SDK } from "codechain-sdk";

export class ServerContext {
    options: ServerConfig;
    db: ElasticSearchAgent;
    codechainSdk: SDK;

    static async newInstance(options: ServerConfig) {
        const context = new ServerContext(options);

        process.on("SIGINT", async () => {
            console.log("Destroying the context...");
            await context.destroy();
            process.exit();
        });

        return context;
    }

    private constructor(options: ServerConfig) {
        this.options = options;
        this.codechainSdk = new SDK(options.codeChain.host);
        this.db = new ElasticSearchAgent(options.elasticSearch.host);
    }

    destroy = async () => {
        // Do nothing
    }
}
