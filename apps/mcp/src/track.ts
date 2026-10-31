type McpEvent = {
  event: "initialize" | "tool_call";
  client_name?: string;
  client_version?: string;
  tool?: string;
  protocol_version?: string;
  install_key?: string;
};

/** Fire-and-forget insert into Supabase `mcp_events`. No-op when env vars are missing. */
export function trackMcp(row: McpEvent): Promise<void> {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return Promise.resolve();
  return fetch(`${url}/rest/v1/mcp_events`, {
    method: "POST",
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify(row),
    signal: AbortSignal.timeout(2000),
  })
    .then(() => undefined)
    .catch(() => undefined);
}
