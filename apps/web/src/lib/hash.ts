import { createHash } from "node:crypto";

export function hashIp(ip: string | undefined | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT ?? "scrollsmith";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}
