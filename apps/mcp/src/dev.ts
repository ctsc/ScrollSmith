import { createServer } from "node:http";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createHandler, installKeyFromUrl } from "./server.js";

const port = Number(process.env.PORT ?? 3001);

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname === "/mcp" || url.pathname.startsWith("/mcp/")) {
    return void toNodeHandler(createHandler(installKeyFromUrl(url)))(req, res);
  }
  res.writeHead(404).end();
}).listen(port, "127.0.0.1", () => {
  console.log(`Scrollsmith MCP dev server: http://127.0.0.1:${port}/mcp`);
});
