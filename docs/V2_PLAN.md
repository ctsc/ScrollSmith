# V2 Plan - Scrollsmith as a free skills MCP

Status: PLANNING (not building yet). Supersedes the "Phase 1 platform
skeleton" in PRODUCT_DECISIONS.md.

## 1. What we are building

A remote **MCP server that serves skills**, plus a **website** that gets
people to install it. No model calls, no generation cost.

```
creator --chat--> Claude / ChatGPT / Gemini / Cursor --MCP--> Scrollsmith server (skills + helpers)
                        |                                   |
                        +-- uses its OWN models/code exec   +--> Supabase (event log, waitlist)
                            to render video/image/voice
```

### Skills -> MCP surface
Source of truth: Carter's skills repo (~50 animation styles; URL TBD).
Each skill = a folder with `SKILL.md` (instructions), optional templates /
assets / scripts. The server exposes them three ways so every client can
use them:

| MCP primitive | what | why |
| --- | --- | --- |
| **tools** `list_skills`, `get_skill(name)`, `search_skills(query)` | catalog + full skill text (+ template files) | tools are the one primitive every client supports (ChatGPT only reliably supports tools) |
| **prompts** one per skill | "Make a <style> video about X" slash-command | nice UX in Claude Desktop / Gemini CLI |
| **resources** `skill://<name>/...` | raw files (SKILL.md, templates, scripts) | lets the assistant pull assets into code execution |

Skill categories = **Video** (animation styles, faceless formats, captions,
stitching via ffmpeg/Remotion), **Image** (thumbnails, scenes, consistent
characters), **Voice** (script -> voiceover with the client's TTS; per-client
notes on what is possible).

Helper tools (optional, cheap, no AI): `caption_srt` (text -> SRT),
`shorts_spec` (returns 9:16 export settings), `ffmpeg_recipe(task)`.

### Website (v2)
- `/` landing = MCP page. Hero, **Add to Claude / ChatGPT / Gemini / Cursor**
  tabs with a copy-link button and exact steps per client, plus the
  capability matrix below. Waitlist stays
  until the server is live, then the CTA becomes "Add to Claude".
- Skill gallery: the ~50 styles as cards with a preview clip each (one
  marquee item per style eventually).
- Unique identity: **3D animated mascot**, real preview videos, mobile-first
  redesign (current mobile is a shrunken desktop).
- `/terms`, `/privacy` (needed to list a ChatGPT connector).
- Analytics -> Supabase `site_events` (copy clicks, tab views).

## 2. Tech

- **Monorepo** (pnpm workspaces): `apps/web` (current Next.js site moved
  here), `apps/mcp` (server), `skills/` (git submodule or synced copy of
  Carter's skills repo; the server reads it at build time).
- **MCP server:** TypeScript, `@modelcontextprotocol/sdk`, Streamable HTTP
  transport (required for ChatGPT connectors and claude.ai remote MCP).
  Deployed as a Vercel function via `mcp-handler` so web + MCP are one
  deploy. Skills are static text, so responses are instant and there are
  no long-running jobs - Vercel Hobby limits are not a problem technically
  (Hobby still forbids commercial use; a free product is a grey area - move
  to Pro if Vercel complains).
- **Data (Supabase):** `waitlist` (exists), `mcp_events` (client name +
  version, tool/prompt/resource, skill name, anonymous client hash),
  `site_events`. Service-role key server-side only, as today.
- **Client install paths:**
  - Claude: claude.ai / Desktop -> Settings -> Connectors -> Add custom
    connector -> paste URL. Claude Code: `claude mcp add --transport http
    scrollsmith <url>`. (Also possible later: publish the skills as a native
    Claude Code plugin/skills pack - zero server needed for Claude users.)
  - ChatGPT: Settings -> Connectors -> Developer mode -> add remote MCP
    URL (requires remote HTTP server + published terms/privacy).
  - Gemini: Gemini CLI `settings.json` `mcpServers` entry works today. The
    consumer Gemini app's support for custom MCP servers is UNVERIFIED -
    check before promising it on the site; label the tab "Gemini CLI" if
    not.
  - Cursor: `.cursor/mcp.json` or the one-click `cursor://` install deep link.

### Per-client capability matrix (what we configure per MCP client)
Decided 2026-10-30: each client gets its own config / skill variants that say
which of video / image / voice it can do and the best route for each. To be
verified hands-on in step 3; current best guess:

| client | video | image | voice | notes |
| --- | --- | --- | --- | --- |
| Claude (Desktop / Code) | yes - code exec: Remotion / ffmpeg / p5 / Manim | via code (SVG/canvas renders); no native image model | no native TTS; script only (hand off to Gemini/other TTS) | Carter already makes his videos here |
| Cursor | yes - same code path as Claude (agent runs scripts locally) | via code | no | best for creators comfortable with a code editor |
| ChatGPT | weak - code interpreter can run ffmpeg/moviepy, no Remotion; Sora is separate | yes - native image gen | limited (voice mode, not file export) | verify what connector tools can trigger |
| Gemini (CLI / app) | CLI: code exec yes; app: unverified | native image gen (app) | strong - native TTS / audio | best voice route |

The server can read the client name from the MCP `initialize` handshake and
return client-specific instructions automatically.

## 3. Order of build

1. Get the skills repo; agree on the skill folder format (`SKILL.md` +
   frontmatter: name, category, description, preview).
2. Monorepo split + CI (lint/build on PR).
3. MCP server: load skills, expose tools/prompts/resources, event logging,
   deploy. Install in Claude, ChatGPT, Gemini CLI; confirm each lists the
   skills and can produce a video from one.
4. Install page on the site (tabs, copy button, per-client steps, "what
   works where", event tracking).
5. Skill gallery + landing redesign: mascot, preview videos, mobile-first
   pass, terms/privacy.
6. v3: Google sign-in for user counting; skill usage stats; community
   skill submissions.

## 4. Open questions for Carter

1. **Skills repo URL** and current folder format - does each skill already
   have a `SKILL.md`-style file, or is it ad-hoc prompts?
2. Which clients have you actually made a full video in? (Claude via code
   execution, presumably.) Anything confirmed in ChatGPT / Gemini / Cursor?
   This fills in the capability matrix.
3. Mascot: Spline (web 3D, free tier, embeds in React) vs. Three.js + GLB vs.
   2D Rive. Devin can wire/animate any of them but cannot sculpt the art -
   need a Spline scene, GLB, or commissioned asset. Any look in mind?
4. Preview videos: 6-8 clips (later one per skill), 9:16, 4-6 s, no audio,
   webm/mp4 under ~2 MB each.
5. Keep "18+ only" in footer/terms? (Default: yes.) Business/entity name for
   the Terms page?
6. Should the skills also ship as a native **Claude Code plugin** (no server
   needed for Claude users) in addition to the MCP? (Default: yes, later.)
