import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { hashIp } from "@/lib/hash";
import { INSTALL_KEY_COOKIE, isInstallKey } from "@/lib/install-key";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function newKey() {
  const bytes = randomBytes(20);
  let out = "k_";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

/** Returns the visitor's install key, minting and recording one on first visit. */
export async function POST(req: Request) {
  const jar = await cookies();
  const existing = jar.get(INSTALL_KEY_COOKIE)?.value;
  if (isInstallKey(existing)) return NextResponse.json({ key: existing });

  const key = newKey();
  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("install_keys").insert({
      key,
      ip_hash: hashIp(req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()),
      user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
      referrer: req.headers.get("referer")?.slice(0, 500) ?? null,
    });
  }
  jar.set(INSTALL_KEY_COOKIE, key, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365 * 2,
    path: "/",
  });
  return NextResponse.json({ key });
}
