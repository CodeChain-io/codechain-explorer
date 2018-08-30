import { getMappingParcel } from "./mapping_parcel";

export const getMappingPendingParcel = () => {
    return {
        properties: {
            status: {
                type: "keyword"
            },
            timestamp: {
                type: "long"
            },
            parcel: getMappingParcel()
        }
    };
};
