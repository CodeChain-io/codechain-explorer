const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "../", "build")));
app.use(express.static(path.join(__dirname, "../", "download")));

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "../", "build", "index.html"));
});

app.listen(5000, () => {
  console.log("Server is running at 5000 port");
});
