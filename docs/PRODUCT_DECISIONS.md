# Product Decisions & Master Plan Notes

Living document. Captures decisions made with Carter, parked questions, and
the phased plan.

Last updated: 2026-10-30

---

## 0. THE PIVOT (2026-10-30) - read this first

Scrollsmith is **not** a standalone AI app anymore. It is a **free MCP
server that serves a curated library of skills** (Carter already has a
GitHub repo of ~50 animation-style skills he uses with Claude to make his
videos). Creators add Scrollsmith to the AI they already pay for - **Claude,
ChatGPT, Google Gemini** - and that AI uses the skills plus *its own*
models/code execution to make faceless short-form video, images and voice.

**Scrollsmith never calls a video / image / voice model and never pays for
generation.** The server only hands the assistant instructions, templates
and helper tools. Hosting cost ~0.

What that removes: in-app Video/Image/Voice pages, composer, library,
credits, pricing, Stripe, Creator Program, mobile app, provider adapters,
job queues, and (for v2) auth/signup. What stays: the landing page (= MCP
page), the waitlist, the Video / Image / Voice framing (now the three skill
categories), the dark neon-blue brand.

- **Price:** completely free, for everyone, forever-ish. Users need their own
  Claude / ChatGPT / Gemini subscription.
- **Clients:** Claude, ChatGPT, Gemini, Cursor (Cursor renders video/images
  through code like Claude). Each client gets its own MCP config stating
  which of video / image / voice it can do and which service/model is best
  for which (e.g. Gemini strong at voice; Claude + Cursor at code-rendered
  animation). The install page shows this matrix.
- **Auth:** none in v2. v3 adds Google sign-in only so we can count users.
- **Tracking in v2:** server logs every MCP connection (client name/version
  from the `initialize` handshake) and every skill fetch; site logs
  "copy MCP link" clicks.
- **Website:** one site, landing = MCP page. Unique identity wanted: a **3D
  animated mascot** that lives on the page. Mobile must look as good as
  desktop. Marquee gets real preview videos (Carter makes them).
- **Repo layout:** same repo, MCP server in its own folder (`apps/mcp`),
  website in `apps/web`.

Everything below section 0 that talks about app pages, pricing, credits,
mobile app, Creator Program or auth is **historical** and kept only for
context.

---

## 1. Positioning (historical, pre-pivot)

- **What:** AI image/video/voice content generation, tailored for content
  creators. Fewer, clearer features than Flashloop.
- **First users:** faceless / short-form content creators posting to
  Instagram Reels, TikTok, and YouTube Shorts. 9:16 first.
- **Brand vibe:** Higgsfield-style dark / cinematic. Flashloop's brand color is
  neon orange; **ours is neon blue**. Homepage must read as professional and
  dead-simple to use.
- **Brand name:** **Scrollsmith AI** (configured in
  `src/config/site.ts`).

## 2. Flashloop feature audit -> what we keep

Flashloop nav today: Studio, Image, Video, Voice, Super Agent, Mirage Studio,
Faceless Studio, Film Studio, Ads Studio, MCP, Creator Program, Pricing,
Login/Signup. Problem: 5-7 tabs that are all "video creation".

| Flashloop                                  | Ours                                                            |
| ------------------------------------------ | --------------------------------------------------------------- |
| Studio / Super Agent (separate pages)      | **One smart composer at the top of the Video page** (not a tab) |
| Video                                      | **Video** (text->video, image->video)                            |
| Mirage / Faceless / Film / Ads Studios     | **Modes inside Video** (Faceless series, Person swap, Cinematic, Ads) |
| Image                                      | **Image**                                                       |
| Voice                                      | **Voice** (voiceover, lip-sync, clone)                           |
| MCP                                        | **MCP page** (Claude, ChatGPT, Cursor) - v1 page only, server in v2 |
| Creator Program                            | **Creator Program** landing + apply (portal later)              |
| Pricing                                    | **Pricing**                                                     |
| Login / Signup                             | Free to sign up, Google OAuth, very low friction                |

Top-level app nav target: **Video | Image | Voice | Library** + marketing pages
(Home, Pricing, MCP, Creator Program).

## 3. Product decisions (confirmed)

1. **Users:** faceless / short-form creators for IG / TikTok / YT Shorts.
2. **Composer:** single prompt composer lives on the Video page, picks
   model/mode for the user. No separate "Super Agent" page.
3. **Library:** yes - projects/library with reusable characters + styles and
   light editing (trim, captions, stitch clips). No full timeline editor.
4. **Pricing (credits-based, no public free tier):**
   - No free tier. A promo **code grants 1,000 credits** as the de-facto free
     trial.
   - **Starter $15/mo**
   - **Creator $40/mo** (shown as 20% off)
   - **Ultra $99/mo** (shown as 40% off)
   - **Custom / Enterprise** - "contact us" for higher volume.
   - Pricing page copy shows the discounted prices with the strike-through
     original (Flashloop does the same with its "30% OFF" banner).
5. **Creator Program:** v1 = landing page + apply form (email capture).
   Portal (submit TikTok/IG links, view tracking, CPM payouts) is phase 2+.
   Flashloop reference: creators post videos with a CTA + referral code, get
   paid a personal CPM per 1k tracked views after 3 videos / 100k views.
6. **MCP:** v1 = marketing page with Claude / ChatGPT / Cursor tabs and
   3-step setup. Actual MCP server (OAuth sign-in, generate video/image/
   voice, list library) is v2.
7. **Platforms:** **both web and mobile app** (Flashloop has iOS + Android).
   Plan: Next.js web + React Native (Expo) mobile sharing a TypeScript API
   client / types package.
8. **Safety / legal:**
   - NSFW strictly filtered (prompt + output moderation).
   - **Age policy (decided 2026-10-30): 18+.** Under-18s may register only
     with parental approval. Signup = DOB/attestation + parental-consent
     path for minors; store the attestation. Rationale: AI providers
     (voice clone, person swap) require 18+, App Store rating will likely
     be 17+/18+ anyway, COPPA floor is 13. Landing page footer says
     "18+ only". Terms, Privacy, AI-safety and copyright policies.
   - Person-swap allowed **only** with (a) pre-made / publicly known AI
     characters (not necessarily made by that user) or (b) the user's own
     uploaded self-image. No arbitrary real people.

## 4. Phased plan

### Phase 0 - Waitlist landing page (DONE, replaced by the install site in V2)
- Single-page site, dark neon-blue cinematic brand.
- Collect emails ("be first to know when the app launches - free to sign
  up"). Store in Supabase `waitlist` table with `source` (`?ref=ig` etc.).
- Deploy to Vercel; link goes in Instagram bio.
- Deliverable: this repo.

### Phase 1 - Platform skeleton (no AI yet)
- Frontend (Next.js) + backend + data model fully set up so the AI
  provider connection is the only missing piece.
- Auth (Supabase, Google OAuth, age gate), pricing + Stripe checkout +
  credit ledger, promo codes (1k credits), Library data model, Video /
  Image / Voice pages with the composer UI, MCP page, Creator Program page.
- Deploy to Supabase + Vercel.

### Phase 2 - AI connection
- Provider adapter layer (text->video, image->video, image gen, TTS,
  lip-sync), async job queue, media storage, moderation, credit metering.
- Faceless series mode first; then person-swap, cinematic, ads modes.

### Phase 3 - Growth surfaces
- MCP server (Claude / ChatGPT / Cursor), Creator Program portal, mobile app
  (Expo) release.

## 5. Parked technical questions (answer before Phase 1)

Defaults in parentheses; we proceed with the default unless changed.

1. **Model access:** aggregator (fal.ai / Replicate) vs. direct vendor APIs
   (Google Vertex / Kling / OpenAI). (Default: fal.ai behind a provider
   adapter layer.) Any provider accounts already owned?
2. **Voice:** ElevenLabs vs. cheaper (OpenAI TTS, Cartesia). (Default:
   ElevenLabs.)
3. **Backend shape:** single FastAPI service (API + workers + later MCP) vs.
   Next.js API routes for CRUD + FastAPI only for generation. (Default:
   single FastAPI service + worker process, Next.js purely frontend.)
4. **Frontend framework:** Next.js App Router vs. Vite SPA. (Default:
   Next.js + TypeScript + Tailwind + shadcn/ui; one repo for marketing +
   app.) Mobile: Expo / React Native sharing a types package.
5. **Supabase scope:** Postgres + Auth (Google OAuth) + Storage, or
   Cloudflare R2 for generated media (zero egress). (Default: Supabase for
   DB/Auth, R2 for media.)
6. **Job queue:** Postgres-backed queue vs. Redis + worker. (Default:
   Postgres queue in v1.)
7. **Hosting:** Vercel (web) + Railway / Fly / Render (FastAPI + workers).
   (Default: Vercel + Railway.) Existing accounts?
8. **Monorepo:** pnpm workspaces (apps/web, apps/mobile, apps/api,
   packages/shared) + GitHub Actions CI. (Default: yes.)
9. **Budget / timeline:** monthly AI API spend during build; target MVP
   date.
10. **Team:** solo + Devin, or other devs / designers?
11. **Email provider** for a launch announcement + transactional
    mail (Resend default).
12. **Analytics** (Vercel Analytics / PostHog default: PostHog).

## Install keys instead of OAuth (V2.1)

- Goal was only "how many people use the MCP". OAuth adds a sign-in step to every
  client for data we don't need (emails), so: no auth.
- The install page mints an anonymous `k_<20 chars>` key per browser (`/api/key`,
  httpOnly cookie, `install_keys` table) and shows `https://mcp.scroll-smith.com/mcp/<key>`.
  The server logs the key on every `initialize` / tool call → distinct installs,
  retention, per-tool usage. Plain `/mcp` still works for people who connected before.
- Waitlist removed from the site (homepage = install page). The Supabase `waitlist`
  table and its rows are kept; nothing writes to it anymore.
