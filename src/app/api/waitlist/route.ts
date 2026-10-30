import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isRateLimited } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  platforms: z.array(z.enum(["instagram", "tiktok", "youtube"])).max(3).optional(),
  source: z.string().trim().max(64).optional(),
  company: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const emailIssue = parsed.error.issues.find((i) => i.path[0] === "email");
    return NextResponse.json(
      { ok: false, error: emailIssue ? "Enter a valid email address." : "Invalid request." },
      { status: 400 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ ok: true, status: "created" });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[waitlist] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
    return NextResponse.json(
      { ok: false, error: "Signups are temporarily unavailable. Please try again soon." },
      { status: 503 },
    );
  }

  const { email, platforms, source } = parsed.data;
  const { error } = await supabase.from("waitlist").insert({
    email,
    platforms: platforms ?? [],
    source: source || null,
    user_agent: request.headers.get("user-agent")?.slice(0, 512) ?? null,
    referrer: request.headers.get("referer")?.slice(0, 512) ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, status: "exists" });
    }
    console.error("[waitlist] insert failed", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, status: "created" });
}
