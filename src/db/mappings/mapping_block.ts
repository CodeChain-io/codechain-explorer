import { getMappingParcel } from "./mapping_parcel";

export const getMappingBlock = () => {
    return {
        properties: {
            author: {
                type: "keyword"
            },
            extraData: {
                properties: {
                    data: {
                        type: "long"
                    },
                    type: {
                        type: "keyword"
                    }
                }
            },
            hash: {
                type: "keyword"
            },
            invoicesRoot: {
                type: "keyword"
            },
            isRetracted: {
                type: "boolean"
            },
            number: {
                type: "long"
            },
            miningReward: {
                type: "keyword"
            },
            parcelsRoot: {
                type: "keyword"
            },
            parentHash: {
                type: "keyword"
            },
            score: {
                type: "keyword"
            },
            seal: {
                properties: {
                    data: {
                        type: "long"
                    },
                    type: {
                        type: "keyword"
                    }
                }
            },
            stateRoot: {
                type: "keyword"
            },
            timestamp: {
                type: "long"
            },
            parcels: getMappingParcel()
        }
    };
};
