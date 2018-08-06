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
    const _ = yargs.command({
        command: "*",
        handler: () => {
            web.run(config);
        }
    }).help().argv;
};

main();
