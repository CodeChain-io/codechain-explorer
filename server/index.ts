import * as yargs from "yargs";

import * as web from "./web";

export interface ServerConfig {
    httpPort: number;
    codeChain: {
        host: string;
    };
    elasticSearch: {
        host: string;
    }
}

const main = () => {
    process.env["NODE_CONFIG_DIR"] = process.env["NODE_CONFIG_DIR"] || (`${__dirname}/config/`);
    const config = require("config") as ServerConfig;

    const _ = yargs.command({
        command: "*",
        handler: () => {
            web.run(config);
        }
    }).help().argv;
};

main();
