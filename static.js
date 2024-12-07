import { existsSync, readFileSync } from "node:fs";
import { ServerResponse } from "node:http";
import { join } from "node:path";

/**
 * @param {string} url
 * @param {ServerResponse} res
 */
export const handleStatic = (url, res) => {
  const pth = join(".", url);

  /** @type {import("node:http").OutgoingHttpHeaders} */
  const headers = {};
  if (pth.endsWith(".js")) {
    headers["content-type"] = "application/javascript";
  } else if (pth.endsWith(".css")) {
    headers["content-type"] = "text/css";
  }

  if (!existsSync(pth)) {
    // 404
    headers["content-length"] = 0;
    res.writeHead(404, headers);
    return res.end();
  }

  const fileContent = readFileSync(pth);
  headers["content-length"] = fileContent.byteLength;

  res.writeHead(200, headers);
  res.write(fileContent);
  return res.end();
};
