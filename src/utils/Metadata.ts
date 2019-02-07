export const parseMetadata = (metadata: string): Metadata => {
    try {
        return JSON.parse(metadata);
    } catch {
        return {};
    }
};

export interface Metadata {
    name?: string;
    description?: string;
    icon_url?: string;
    gateway?: { url?: string };
}
