const dotenv = require("dotenv");
const fs = require("fs-extra");
const path = require("path");
const { Client } = require("elasticsearch");

// Read and load `.env` file into `process.env`
dotenv.config();

const clearIndex = async () => {
  const host = process.env.elasticsearch_host || "http://localhost:9200";
  const client = new Client({
    host
  });
  await client.indices.delete({
    index: "_all"
  });
  try {
    const imageDir = path.join(__dirname, "../", "/download");
    const isExists = await fs.pathExists(imageDir);
    if (isExists) {
      await fs.remove(imageDir);
    }
    console.log("All asset images are deleted.");
  } catch (err) {
    console.error(err);
  }

  console.log("All indices are deleted.");
};
clearIndex();
