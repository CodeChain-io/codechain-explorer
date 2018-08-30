import { getMappingTransaction } from "./mapping_transaction";

export const getMappingParcel = () => {
    return {
        properties: {
            action: {
                properties: {
                    action: {
                        type: "keyword"
                    },
                    receiver: {
                        type: "keyword"
                    },
                    transactions: getMappingTransaction(),
                    value: {
                        type: "keyword"
                    },
                    invoice: {
                        type: "boolean"
                    },
                    errorType: {
                        type: "keyword"
                    }
                }
            },
            blockHash: {
                type: "keyword"
            },
            sender: {
                type: "keyword"
            },
            timestamp: {
                type: "long"
            },
            countOfTransaction: {
                type: "long"
            },
            blockNumber: {
                type: "long"
            },
            fee: {
                type: "keyword"
            },
            hash: {
                type: "keyword"
            },
            networkId: {
                type: "keyword"
            },
            nonce: {
                type: "keyword"
            },
            parcelIndex: {
                type: "long"
            },
            sig: {
                type: "keyword"
            },
            isRetracted: {
                type: "boolean"
            }
        }
    };
};
