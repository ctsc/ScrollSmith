-- Waitlist signups collected by the landing page.
-- Run this in the Supabase SQL editor (or `supabase db push`).

create extension if not exists citext;

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       citext not null unique,
  platforms   text[] not null default '{}',
  source      text,
  referrer    text,
  user_agent  text,
  notified_at timestamptz,
  created_at  timestamptz not null default now()
);

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);
create index if not exists waitlist_source_idx on public.waitlist (source);

-- Lock the table down: only the service role (used server-side by the
-- Next.js API route) can read/write. The anon key can do nothing.
alter table public.waitlist enable row level security;
revoke all on public.waitlist from anon, authenticated;
