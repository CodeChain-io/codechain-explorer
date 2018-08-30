import * as yargs from "yargs";

import config from "./config";
import * as web from "./web";

export interface ServerConfig {
    httpPort: number;
    codeChain: {
        host: string;
    };
    elasticSearch: {
        host: string;
    };
}

const main = () => {
    const _ = yargs
        .command({
            command: "*",
            handler: () => {
                web.run(config);
            }
        })
        .help().argv;
};

main();
