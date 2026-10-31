-- Anonymous per-visitor install keys: the install page mints one per browser and
-- bakes it into the MCP URL (https://mcp.scroll-smith.com/mcp/<key>) so unique
-- installs and retention can be counted without accounts.
create table if not exists public.install_keys (
  key text primary key,
  ip_hash text,
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists install_keys_created_at_idx
  on public.install_keys (created_at desc);

alter table public.mcp_events add column if not exists install_key text;
create index if not exists mcp_events_install_key_idx
  on public.mcp_events (install_key);

alter table public.site_events add column if not exists install_key text;

alter table public.install_keys enable row level security;
revoke all on public.install_keys from anon, authenticated;
