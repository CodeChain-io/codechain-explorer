import * as dotenv from "dotenv";

// Read and load `.env` file into `process.env`
dotenv.config();

export default {
    elasticSearch: {
        host: process.env.ELASTICSEARCH_HOST || "http://localhost:9200",
    },
    codeChain: {
        host: process.env.CODECHAIN_HOST || "http://localhost:8080",
    },
    defaultMiningReward: process.env.REACT_APP_DEFAULT_MINING_REWARD ? Number(process.env.REACT_APP_DEFAULT_MINING_REWARD) : 50,
    genesisAddressList: process.env.GENESIS_ADDRESS_LIST ? process.env.GENESIS_ADDRESS_LIST.split(",") : [],
    cron: {
        blockWatch: "*/5 * * * * *",
    },
};
