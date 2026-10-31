export type SiteEvent = "copy_mcp_url" | "copy_snippet" | "install_tab" | "cursor_deeplink";
export type McpClient = "claude" | "chatgpt" | "gemini" | "cursor";

export function track(event: SiteEvent, client?: McpClient, key?: string | null) {
  if (typeof window === "undefined") return;
  const body = JSON.stringify({ event, client, key: key ?? undefined, path: window.location.pathname });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/events", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
    }
  } catch {}
}
