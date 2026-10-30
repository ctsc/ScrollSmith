import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { site } from "@/config/site";

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 pb-24 pt-36 sm:pt-40">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-muted">Last updated {site.legalUpdated}</p>
          <p className="mt-6 text-muted">{intro}</p>
          <div className="legal mt-10 space-y-8 text-fg/90">{children}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold tracking-tight text-fg">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed sm:text-base">{children}</div>
    </section>
  );
}
