import { createServer } from "node:http";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createHandler, installKeyFromPath } from "./server.js";

const port = Number(process.env.PORT ?? 3001);

createServer((req, res) => {
  const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
  if (pathname === "/mcp" || pathname.startsWith("/mcp/")) {
    return void toNodeHandler(createHandler(installKeyFromPath(pathname)))(req, res);
  }
  res.writeHead(404).end();
}).listen(port, "127.0.0.1", () => {
  console.log(`Scrollsmith MCP dev server: http://127.0.0.1:${port}/mcp`);
});
