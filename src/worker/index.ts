import { BlockSyncWorker } from "./BlockSyncWorker";
import { CodeChainAgent } from "./CodeChainAgent";
import { ElasticSearchAgent } from "../db/ElasticSearchAgent";
import config from "./config";

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

const app = () => {
    const nodeConfigDir = "NODE_CONFIG_DIR";
    process.env[nodeConfigDir] = process.env[nodeConfigDir] || (`${__dirname}/config/`);
    const elasticSearchAgent = new ElasticSearchAgent(config.elasticSearch.host);
    const codeChainAgent = new CodeChainAgent(config.codeChain.host);
    const worker = new BlockSyncWorker(config, codeChainAgent, elasticSearchAgent);
    worker.start();
};

app();
