import { createServer } from "node:http";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { handler } from "./server.ts";

const port = Number(process.env.PORT ?? 3001);
const nodeHandler = toNodeHandler(handler);

createServer((req, res) => {
  if (req.url?.startsWith("/mcp")) return void nodeHandler(req, res);
  res.writeHead(404).end();
}).listen(port, "127.0.0.1", () => {
  console.log(`Scrollsmith MCP dev server: http://127.0.0.1:${port}/mcp`);
});
