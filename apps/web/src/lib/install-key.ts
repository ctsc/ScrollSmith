import { site } from "@/config/site";

/** Anonymous per-visitor key that personalises the MCP URL so installs can be counted without accounts. */
export const INSTALL_KEY_RE = /^k_[a-z0-9]{20}$/;
export const INSTALL_KEY_COOKIE = "ss_key";

export function isInstallKey(v: unknown): v is string {
  return typeof v === "string" && INSTALL_KEY_RE.test(v);
}

export function mcpUrlFor(key?: string | null) {
  return key ? `${site.mcpUrl}/${key}` : site.mcpUrl;
}
