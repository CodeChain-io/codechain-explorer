const dotenv = require("dotenv");
const {
    Client,
    SearchResponse,
    DeleteDocumentResponse
} = require("elasticsearch");

// Read and load `.env` file into `process.env`
dotenv.config();

const clearIndex = async () => {
    const host = process.env.elasticsearch_host || "http://localhost:9200"
    const client = new Client({
        host
    });
    await client.indices.delete({
        index: "_all"
    });

    console.log("All indices are deleted.");
}
clearIndex();
