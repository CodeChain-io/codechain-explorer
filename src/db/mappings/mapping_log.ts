export const getMappingLog = () => {
    return {
        properties: {
            date: {
                type: "date",
                format: "yyyy-MM-dd"
            },
            count: {
                type: "long"
            },
            type: {
                type: "keyword"
            },
            value: {
                type: "keyword"
            }
        }
    };
};
