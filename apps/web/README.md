# Scrollsmith AI — waitlist landing page

Phase-0 landing page for the AI short-form video platform (see
[`docs/PRODUCT_DECISIONS.md`](docs/PRODUCT_DECISIONS.md) for the product plan).
Collects emails into a Supabase `waitlist` table. Built with Next.js 16,
TypeScript and Tailwind v4; deploys to Vercel.

## Local dev

```bash
pnpm install
cp .env.example .env.local   # fill in the Supabase values
pnpm dev                     # http://localhost:3000
```

`pnpm build && pnpm start` runs the production build. `pnpm lint` runs ESLint.

## One-time setup

### 1. Supabase (stores the emails)

1. Create a project at https://supabase.com/dashboard.
2. Open **SQL Editor** and run [`supabase/migrations/0001_waitlist.sql`](supabase/migrations/0001_waitlist.sql).
3. Go to **Project Settings -> API** and copy:
   - Project URL -> `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`; either works)
   - `service_role` secret key -> `SUPABASE_SERVICE_ROLE_KEY` (server-only, never prefix with `NEXT_PUBLIC_`).

View signups in **Table Editor -> waitlist**, or export with
`select email from waitlist order by created_at;`.

### 2. Vercel (hosts the site)

1. Push this repo to GitHub and import it at https://vercel.com/new (framework: Next.js, defaults are fine).
2. Add environment variables (Production + Preview):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` = your final URL (e.g. `https://scrollsmith.ai`) — used for OG/canonical tags.
3. Deploy. Attach your domain under **Settings -> Domains**.

### 3. Instagram bio link

Use `https://your-domain.com/?ref=ig` so signups are tagged with `source = ig`.
Any `?ref=` (or `?utm_source=`) value is stored, so you can use `?ref=tt`,
`?ref=yt`, etc. per platform.

## Changing the brand

Everything brand-related lives in [`src/config/site.ts`](src/config/site.ts)
(name, tagline, hero copy, social links). Colors are CSS variables at the top
of [`src/app/globals.css`](src/app/globals.css) (`--color-primary` is the neon
blue). The favicon is `src/app/icon.svg`; the social share image is generated
by `src/app/opengraph-image.tsx`.

## How the waitlist works

- `POST /api/waitlist` (`src/app/api/waitlist/route.ts`) validates the body with
  zod, drops honeypot submissions, rate-limits by IP (5 / 10 min per instance),
  and inserts into `waitlist` using the service-role key.
- Duplicate emails return `{ status: "exists" }` and the UI shows a friendly
  "already on the list" message.
- Each row stores `email`, `platforms` (Instagram / TikTok / YouTube chips),
  `source` (`?ref=`), `referrer`, `user_agent`, `created_at`, and a
  `notified_at` column you can fill when you send the launch email.
