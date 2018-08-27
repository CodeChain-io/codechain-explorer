import { BlockSyncWorker } from "./BlockSyncWorker";
import { CodeChainAgent } from "./CodeChainAgent";
import { ElasticSearchAgent } from "../db/ElasticSearchAgent";
import config from "./config";
import TypeConverter from "./TypeConverter";

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
    miningReward: {
        solo: number,
        husky: number
    },
    genesisAddressList: {
        solo: string[],
        husky: string[]
    }
}

const app = () => {
    const elasticSearchAgent = new ElasticSearchAgent(config.elasticSearch.host);
    const codeChainAgent = new CodeChainAgent(config.codeChain.host);
    const typeConverter = new TypeConverter(elasticSearchAgent, codeChainAgent);
    const worker = new BlockSyncWorker(config, codeChainAgent, elasticSearchAgent, typeConverter);
    worker.start();
};

app();
