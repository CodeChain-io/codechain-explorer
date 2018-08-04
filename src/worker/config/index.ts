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
    cron: {
        blockWatch: "*/5 * * * * *",
    },
};
