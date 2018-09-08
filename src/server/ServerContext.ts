import { ElasticSearchAgent } from "codechain-es";
import { SDK } from "codechain-sdk";
import { ServerConfig } from ".";

export class ServerContext {
    public static async newInstance(options: ServerConfig) {
        const context = new ServerContext(options);

        process.on("SIGINT", async () => {
            console.log("Destroying the context...");
            await context.destroy();
            process.exit();
        });

        return context;
    }
    public options: ServerConfig;
    public db: ElasticSearchAgent;
    public codechainSdk: SDK;

    private constructor(options: ServerConfig) {
        this.options = options;
        this.codechainSdk = new SDK({ server: options.codeChain.host });
        this.db = new ElasticSearchAgent(options.elasticSearch.host);
    }

    public destroy = async () => {
        // Do nothing
    };
}
