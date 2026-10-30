# @scrollsmith/mcp

The Scrollsmith MCP server. Stateless Streamable HTTP, no auth, no model calls:
it serves skills (instructions, templates, helper recipes) that the user's own
AI assistant executes. Built on `@modelcontextprotocol/server` v2.

- Public endpoint: `https://mcp.scroll-smith.com/mcp`
- Tools today: `scrollsmith_status`, `list_skills` (stub until skills land)

## Local

```bash
pnpm --filter @scrollsmith/mcp dev     # http://127.0.0.1:3001/mcp
pnpm --filter @scrollsmith/mcp typecheck
```

Smoke test with the MCP Inspector: `npx @modelcontextprotocol/inspector`, transport
"Streamable HTTP", URL above.

## Deploy (Vercel)

1. Vercel → Add New Project → import `ctsc/ScrollSmith` again → name `scrollsmith-mcp`.
2. Root Directory: `apps/mcp`. Framework preset: Other. No build command needed.
3. Deploy. Then Settings → Domains → add `mcp.scroll-smith.com`
   (GoDaddy: CNAME `mcp` → `cname.vercel-dns.com`).
4. Add any extra hostname to `PUBLIC_HOSTS` in `src/server.ts` (Host header allow-list).
