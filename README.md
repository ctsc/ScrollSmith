# Scrollsmith

Monorepo for [scroll-smith.com](https://www.scroll-smith.com).

| folder | what | deploy |
| --- | --- | --- |
| `apps/web` | Next.js site: landing page, waitlist, `/mcp` install page | Vercel project `scroll-smith` (Root Directory: `apps/web`) |
| `apps/mcp` | Scrollsmith MCP server (Streamable HTTP, stateless) | Vercel project `scrollsmith-mcp` (Root Directory: `apps/mcp`) → `mcp.scroll-smith.com` |
| `docs` | product decisions and plans | — |

```bash
pnpm install
pnpm dev              # site on :3000
pnpm --filter @scrollsmith/mcp dev   # MCP server on :3001/mcp
pnpm build && pnpm lint
```

Each app has its own README with env vars and deploy steps.
