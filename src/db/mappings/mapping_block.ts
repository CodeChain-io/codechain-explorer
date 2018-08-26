import { getMappingParcel } from "./mapping_parcel";

export const getMappingBlock = () => {
    return {
        "properties": {
            "author": {
                "type": "keyword",
            },
            "extraData": {
                "type": "keyword",
            },
            "hash": {
                "type": "keyword",
            },
            "invoicesRoot": {
                "type": "keyword",
            },
            "isRetracted": {
                "type": "boolean"
            },
            "number": {
                "type": "long"
            },
            "miningReward": {
                "type": "keyword"
            },
            "parcelsRoot": {
                "type": "keyword",
            },
            "parentHash": {
                "type": "keyword",
            },
            "score": {
                "type": "keyword",
            },
            "seal": {
                "type": "keyword",
            },
            "stateRoot": {
                "type": "keyword",
            },
            "timestamp": {
                "type": "long"
            },
            "parcels": getMappingParcel()
        }
    }
}
