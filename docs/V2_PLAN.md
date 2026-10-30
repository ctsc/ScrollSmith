# V2 Plan - Scrollsmith as a free MCP

Status: PLANNING (not building yet). Supersedes the "Phase 1 platform
skeleton" in PRODUCT_DECISIONS.md.

## 1. What we are building

A remote **MCP server** + a **website** that gets people to install it.

```
creator  --chat-->  Claude / ChatGPT / Cursor  --MCP-->  Scrollsmith server  --API-->  video/image/voice models
                                                              |
                                                              +--> Supabase (event log, waitlist)
```

### MCP tools (v2 surface)
| tool | does | returns |
| --- | --- | --- |
| `make_short` | end-to-end faceless short: script -> voiceover -> visuals -> captions -> 9:16 mp4 | job id, then mp4 URL |
| `generate_video` | text/image -> 9:16 clip, modes: normal, faceless, person-swap (AI characters / own likeness only), cinematic, ads | job id -> mp4 URL |
| `generate_image` | thumbnails, scenes, consistent characters, edit-by-prompt, upscale | png/jpg URL |
| `generate_voice` | voiceover, lip-sync, clone (own voice), languages | mp3/wav URL |
| `check_job` | poll a long-running job | status / URL |
| `list_styles` / `list_characters` | presets the assistant can offer | JSON |

Video generation takes 1-10 min, so tools return a job id immediately and
the assistant polls `check_job` (MCP tools must answer in seconds).

v2 ships the server **with mock outputs** (sample clips/images/audio,
realistic delays) so we can test the install flow in every client before
paying for models. Real providers (fal.ai adapter: Kling/Veo/Seedance,
Flux; ElevenLabs for voice) are v3.

### Website (v2)
- `/` landing = MCP page. Hero, "Add to Claude / ChatGPT / Cursor" tabs with
  a **copy-link button** + one-click deep links where the client supports
  them (`cursor://` install link; Claude Desktop config snippet; ChatGPT
  connector URL). Waitlist stays until the server is live, then the CTA
  becomes "Add to Claude".
- Unique identity: **3D animated mascot** (see question 4), real preview
  videos in the marquee, redesigned mobile layout (currently a weak copy of
  desktop).
- `/terms`, `/privacy` (required to list a ChatGPT connector; also our
  18+/NSFW/person-swap rules live here).
- Analytics: copy-link clicks and install-tab views -> Supabase `site_events`
  (or PostHog).

## 2. Tech

- **Monorepo** (pnpm workspaces): `apps/web` (current Next.js site moved
  here), `apps/mcp` (MCP server), `packages/shared` (tool schemas, types).
- **MCP server:** TypeScript, `@modelcontextprotocol/sdk`, Streamable HTTP
  transport (required for ChatGPT and claude.ai connectors; Cursor and
  Claude Desktop also accept it). Deployed as a Vercel function via Vercel's
  `mcp-handler` so web + MCP are one deploy. Fallback if function timeouts
  bite: Fly.io / Railway container.
- **Jobs:** provider queues (fal.ai queue API) + a Supabase `jobs` table;
  `check_job` reads it. No Redis.
- **Data (Supabase):** `waitlist` (exists), `mcp_events` (client name,
  client version, tool, duration, anonymous client hash), `jobs`,
  `site_events`. Service-role key server-side only, as today.
- **Hosting note:** Vercel Hobby forbids commercial use and caps function
  duration; expect to move to Pro ($20/mo) once the server is public.
- **Client support:** Claude Desktop + claude.ai (custom connectors), ChatGPT
  (connectors / developer mode, remote MCP only), Cursor (`mcp.json`),
  Gemini CLI (supports MCP). The Gemini consumer app does not take custom
  MCP servers today - list it as "Gemini CLI" or leave it off.

## 3. Order of build

1. Monorepo split, CI (lint/build on PR).
2. MCP server skeleton with mock tools + event logging; deploy; install in
   Claude Desktop, Cursor, ChatGPT and confirm each shows the tools.
3. MCP install page on the site (tabs, copy button, deep links, event
   tracking).
4. Landing redesign: mascot, preview videos, mobile-first pass, terms/privacy.
5. v3: real providers + cost model, Google sign-in, per-user quotas.

## 4. Open questions for Carter (answer before building)

1. **Who pays for generations?** An MCP only gives the assistant tools; our
   server still calls a video/image/voice model and that costs money per
   call (roughly $0.05-0.50 per clip, $0.01-0.05 per image, ~$0.02 per
   100 words of voice).
   - A. **Bring your own key** - user gives the assistant their fal.ai /
     ElevenLabs key once. Free for us. More setup for them.
   - B. **We pay** - small free daily quota per client; abuse is hard to stop
     without accounts (fixed in v3 by sign-in).
   - C. **Hybrid** - tiny free demo quota, then BYOK. (Default proposal.)
2. **End-to-end `make_short`** in addition to the three tools? (Default: yes,
   it is the whole value for faceless creators.)
3. **Vercel for the MCP server** (one deploy) vs. a separate container host?
   (Default: Vercel + `mcp-handler`; move if timeouts bite.)
4. **Mascot:** build in Spline (web-native 3D, free tier, embeds in React) vs.
   custom Three.js model vs. 2D Rive animation. Devin can wire up and animate
   any of these but cannot sculpt the character art - we need a Spline
   scene, a GLB model, or a commissioned asset. Any look in mind?
5. **Preview videos:** Carter generates 6-8 clips, 9:16, 4-6 s, no audio,
   webm/mp4 under ~2 MB each. Which model will you use (Kling / Veo / etc.)?
6. **Analytics:** Supabase tables only, or add PostHog? (Default: Supabase
   only until v3.)
7. **Legal:** keep "18+ only" in the footer and in terms? (Default: yes;
   provider terms require it.) Business name/entity for the terms page?
8. **Gemini:** ship with Claude / ChatGPT / Cursor only, Gemini CLI as a
   fourth tab? (Default: three tabs; add Gemini CLI tab if trivial.)
