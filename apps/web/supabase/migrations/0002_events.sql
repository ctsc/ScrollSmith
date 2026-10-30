-- Usage tracking without accounts. No personal data: IPs are hashed with a server-side salt.

create table if not exists public.mcp_events (
  id bigint generated always as identity primary key,
  event text not null,                 -- initialize | tool_call
  client_name text,
  client_version text,
  tool text,
  protocol_version text,
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists mcp_events_created_at_idx on public.mcp_events (created_at desc);
create index if not exists mcp_events_client_idx on public.mcp_events (client_name);

create table if not exists public.site_events (
  id bigint generated always as identity primary key,
  event text not null,                 -- copy_mcp_url | copy_snippet | install_tab | cursor_deeplink
  client text,                         -- claude | chatgpt | gemini | cursor
  path text,
  referrer text,
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists site_events_created_at_idx on public.site_events (created_at desc);

alter table public.mcp_events enable row level security;
alter table public.site_events enable row level security;
revoke all on public.mcp_events from anon, authenticated;
revoke all on public.site_events from anon, authenticated;
