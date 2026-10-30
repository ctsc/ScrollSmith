import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { site } from "@/config/site";
import { WaitlistForm } from "./WaitlistForm";
import { PhoneCard, scenes } from "./PhoneCard";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute left-1/2 top-[-20rem] h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px] animate-pulse-slow" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary animate-fade-up">
            <Sparkles className="size-3.5" />
            {site.launchCopy.badge}
          </span>

          <h1 className="mt-6 font-display text-[clamp(2rem,9.6vw,3.75rem)] font-semibold leading-[1.05] tracking-tight whitespace-nowrap lg:text-6xl animate-fade-up delay-100">
            {site.launchCopy.headline.map((line, i) => (
              <span key={line} className={i === 2 ? "block gradient-text text-glow" : "block"}>
                {line}
              </span>
            ))}
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-muted sm:text-lg lg:mx-0 animate-fade-up delay-200">
            {site.launchCopy.subheadline}
          </p>

          <div className="mx-auto mt-8 max-w-xl lg:mx-0 animate-fade-up delay-300">
            <Suspense fallback={<div className="h-12 rounded-xl bg-surface/60" />}>
              <WaitlistForm id="waitlist" />
            </Suspense>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted lg:justify-start animate-fade-up delay-500">
            <span>Works with</span>
            {site.assistants.map((a) => (
              <span key={a} className="font-medium text-fg">{a}</span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden h-[34rem] w-full max-w-md lg:block">
          <div className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[90px]" />
          <PhoneCard scene={scenes[0]} className="absolute left-0 top-10 -rotate-6 animate-float" />
          <PhoneCard scene={scenes[3]} className="absolute left-1/2 top-0 z-10 -translate-x-1/2 scale-110 shadow-glow-lg animate-float [animation-delay:1.2s]" />
          <PhoneCard scene={scenes[5]} className="absolute right-0 top-16 rotate-6 animate-float [animation-delay:2.4s]" />
        </div>
      </div>
    </section>
  );
}
