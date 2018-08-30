import * as dotenv from "dotenv";

// Read and load `.env` file into `process.env`
dotenv.config();

export default {
    elasticSearch: {
        host: process.env.ELASTICSEARCH_HOST || "http://localhost:9200"
    },
    codeChain: {
        host: process.env.CODECHAIN_HOST || "http://localhost:8080"
    },
    miningReward: {
        solo: 0,
        husky: 50000000000
    },
    genesisAddressList: {
        solo: [
            "tccqzn9jjm3j6qg69smd7cn0eup4w7z2yu9my9a2k78",
            "tccqzwvud8h4vv9c746rd7gzsxkyz6tm22p6c9gekrh",
            "tccqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpqafj6hj",
            "tccqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqquktnjcq",
            "tccqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqcep35h6",
            "tccqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq5glh7xa",
            "tccqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs844cf8",
            "tccqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqvr2m2dn",
            "tccqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgvqevzf",
            "tccqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqya7lxnw"
        ],
        husky: ["tccqqdu5w93amf8xuv3yayzvpfph964a5s2j56hx5pa"]
    },
    cron: {
        blockWatch: "*/5 * * * * *"
    }
};
