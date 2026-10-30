import { Suspense } from "react";
import { WaitlistForm } from "./WaitlistForm";

export function FinalCTA() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-b from-primary/15 via-bg-elevated to-bg-elevated px-6 py-16 text-center sm:px-12">
        <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[24rem] w-[40rem] -translate-x-1/2 rounded-full bg-primary/30 blur-[120px]" />
        <div className="relative mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Be first when the doors open
          </h2>
          <p className="mt-4 text-muted">
            Get one email when the Scrollsmith MCP goes live, with the link to add it to Claude, ChatGPT or Gemini. Completely free.
          </p>
          <div className="mt-8">
            <Suspense fallback={<div className="h-12 rounded-xl bg-surface/60" />}>
              <WaitlistForm id="waitlist-bottom" compact />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
