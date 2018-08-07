import { getMappingParcel } from "./mapping_parcel";

export const getMappingPendingParcel = () => {
    return {
        "properties": {
            "status": {
                "type": "text",
                "fields": {
                    "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                    }
                }
            },
            "timestamp": {
                "type": "long"
            },
            "parcel": getMappingParcel()
        }
    }
}
