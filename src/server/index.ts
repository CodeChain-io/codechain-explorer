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
    web.run(config);
};

main();
