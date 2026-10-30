import { X, Check } from "lucide-react";

const them = ["Studio", "Image", "Video", "Voice", "Super Agent", "Mirage Studio", "Faceless Studio", "Film Studio", "Ads Studio"];
const us = ["Video", "Image", "Voice"];

export function Simplicity() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-10 rounded-[2rem] border border-border bg-bg-elevated p-8 sm:p-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-primary">Why creators switch</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Nine tabs is not a feature.
          </h2>
          <p className="mt-4 text-muted">
            Most AI video apps ship every model and every &ldquo;studio&rdquo; as its own page. You end up paying for a toolbox when you wanted a video. We put the complexity behind one prompt box, so you spend your time on ideas, not menus.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["One composer that picks the right model for you", "Your characters, styles and clips saved in one library", "Priced for creators: simple monthly plans, no surprise fees"].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Everyone else</p>
            <ul className="mt-4 space-y-2">
              {them.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-muted line-through decoration-muted/50">
                  <X className="size-3.5 text-red-400/70" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/40 bg-primary/10 p-5 shadow-glow">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">Us</p>
            <ul className="mt-4 space-y-2">
              {us.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm font-medium">
                  <Check className="size-3.5 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted">Everything else lives inside Video as a mode.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
