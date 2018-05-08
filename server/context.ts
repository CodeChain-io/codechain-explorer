import { SDK } from "codechain-sdk";

import { ServerConfig } from "./";

export class ServerContext {
    options: ServerConfig;
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
        this.codechainSdk = new SDK(options.sdkHttpServer);
    }

    destroy = async () => {
        // Do nothing
    }
}
