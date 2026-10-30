"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { platforms, site, type Platform } from "@/config/site";

type State = { kind: "idle" } | { kind: "loading" } | { kind: "done"; message: string } | { kind: "error"; message: string };

export function WaitlistForm({ id, compact = false }: { id?: string; compact?: boolean }) {
  const searchParams = useSearchParams();
  const source = searchParams.get("ref") ?? searchParams.get("utm_source") ?? undefined;

  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<Platform[]>([]);
  const [state, setState] = useState<State>({ kind: "idle" });

  function toggle(p: Platform) {
    setSelected((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "loading") return;
    setState({ kind: "loading" });
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          platforms: selected,
          source,
          company: form.get("company") ?? "",
        }),
      });
      const data = (await res.json()) as { ok: boolean; status?: string; error?: string };
      if (!res.ok || !data.ok) {
        setState({ kind: "error", message: data.error ?? "Something went wrong." });
        return;
      }
      setState({
        kind: "done",
        message: data.status === "exists" ? site.launchCopy.duplicate : site.launchCopy.success,
      });
    } catch {
      setState({ kind: "error", message: "Network error. Please try again." });
    }
  }

  if (state.kind === "done") {
    return (
      <div id={id} className="flex items-start gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-left animate-fade-up">
        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary text-bg">
          <Check className="size-4" />
        </span>
        <p className="text-sm text-fg sm:text-base">{state.message}</p>
      </div>
    );
  }

  return (
    <form id={id} onSubmit={onSubmit} className="w-full text-left" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={`${id ?? "wl"}-email`}>Email address</label>
        <input
          id={`${id ?? "wl"}-email`}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@creator.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 flex-1 rounded-xl border border-border bg-surface/80 px-4 text-base text-fg placeholder:text-muted/70 outline-none transition focus:border-primary focus:shadow-glow"
        />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <button
          type="submit"
          disabled={state.kind === "loading"}
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-bg transition hover:bg-white disabled:opacity-70"
        >
          {state.kind === "loading" ? <Loader2 className="size-4 animate-spin" /> : null}
          {site.launchCopy.cta}
          {state.kind !== "loading" ? <ArrowRight className="size-4 transition group-hover:translate-x-0.5" /> : null}
        </button>
      </div>

      {!compact ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">I post on:</span>
          {platforms.map((p) => {
            const active = selected.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => toggle(p.id)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  active
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border text-muted hover:border-muted hover:text-fg"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <p className="mt-3 min-h-5 text-xs text-muted" aria-live="polite">
        {state.kind === "error" ? (
          <span className="text-red-400">{state.message}</span>
        ) : (
          "Free to sign up. No spam, just one email when we open the doors."
        )}
      </p>
    </form>
  );
}
