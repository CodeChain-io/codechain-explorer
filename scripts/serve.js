const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const app = express();
// Read and load `.env` file into `process.env`
dotenv.config();
const port = process.env.SERVE_PORT || "5000";

app.use(express.static(path.join(__dirname, "../", "build")));

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "../", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running at ${port} port`);
});
