import * as yargs from "yargs";

import * as web from "./web";
import config from "./config";

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
    const configDir = "NODE_CONFIG_DIR";
    process.env[configDir] = process.env[configDir] || (`${__dirname}/config/`);
    const _ = yargs.command({
        command: "*",
        handler: () => {
            web.run(config);
        }
    }).help().argv;
};

main();
