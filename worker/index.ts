import { BlockSyncWorker } from "./BlockSyncWorker";
import { CodeChainAgent } from "./CodeChainAgent";
import { ElasticSearchAgent } from "./ElasticSearchAgent";

export interface WorkerConfig {
    elasticSearch: {
        host: string
    },
    codeChain: {
        host: string
    },
    cron: {
        blockWatch: string
    }
}

let worker: BlockSyncWorker;
let sigintCounter = 0;
process.on("SIGINT", () => {
    const COUNTER_THRESHOLD = 10;
    worker.destroy();
    if (++sigintCounter >= 2) {
        if (sigintCounter === COUNTER_THRESHOLD) {
            process.exit();
        } else {
            console.warn(`left ${COUNTER_THRESHOLD - sigintCounter} Ctrl+C to panic`);
        }
    }
});

const app = () => {
    const nodeConfigDir = "NODE_CONFIG_DIR";
    process.env[nodeConfigDir] = process.env[nodeConfigDir] || (`${__dirname}/config/`);
    const config = require("config") as WorkerConfig;
    const elasticSearchAgent = new ElasticSearchAgent(config.elasticSearch.host);
    const codeChainAgent = new CodeChainAgent(config.codeChain.host);
    worker = new BlockSyncWorker(config, codeChainAgent, elasticSearchAgent);
    worker.start();
};

app();
