import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { handleStatic } from "./static.js";

const server = createServer((req, res) => {
  const url = req.url;
  if (!url) throw new Error("no url wtf");

  if (url.startsWith("/static")) {
    return handleStatic(url, res);
  }

  if (url !== "/") {
    res.writeHead(404);
    return res.end();
  }

  const responseContent = readFileSync("./index.html");

  res.writeHead(200, {
    // "content-length": Buffer.byteLength(responseContent),
    "content-length": responseContent.byteLength,
    "content-type": "text/html",
  });
  // res.write(Buffer.from(responseContent));
  res.write(responseContent);
  res.end();
});

console.log("Listening on port 8000");
server.listen(8000, "127.0.0.1");
