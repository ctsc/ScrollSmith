import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { hashIp } from "@/lib/hash";

const schema = z.object({
  event: z.enum(["copy_mcp_url", "copy_snippet", "install_tab", "cursor_deeplink"]),
  client: z.enum(["claude", "chatgpt", "gemini", "cursor"]).optional(),
  path: z.string().max(200).optional(),
});

export async function POST(req: Request) {
  const body = schema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ ok: false }, { status: 400 });
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ ok: true });
  await supabase.from("site_events").insert({
    ...body.data,
    referrer: req.headers.get("referer")?.slice(0, 500) ?? null,
    ip_hash: hashIp(req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()),
  });
  return NextResponse.json({ ok: true });
}
