import express from "express";
import { readFileSync } from "fs";
import { resolve } from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
app.get(/\.(js|css|map|png|jp[2g]|webp|tiff|jfif|jpeg(2000)?|ico|bem|gif|svg)$/, express.static("dist"));

app.get("/", (req, res) => {
  res.contentType("text/html");
  res.status(200);
  res.send(
    readFileSync(resolve(__dirname, "./dist/index.html"), {
      encoding: "utf8",
    })
  );
});

app.listen(PORT);
