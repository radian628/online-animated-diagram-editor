const express = require("express");
const bodyParser = require("body-parser");
const path = require("node:path");
const cors = require("cors");
const fs = require("node:fs/promises");
const proxy = require("express-http-proxy")

const app = express();

app.use(cors());

app.use("/service", proxy("localhost:3000"));

app.use(bodyParser.raw());

app.post("/image/:imagename", async (req, res) => {
    await fs.writeFile(path.join(__dirname, "images", req.params.imagename), req.body);
    console.log("read file ", req.params.imagename);
    res.end();
});

app.listen(8080);