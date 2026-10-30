import { Clapperboard, ImageIcon, Mic, Check } from "lucide-react";

const pillars = [
  {
    icon: Clapperboard,
    name: "Video",
    tag: "Text & image to video",
    desc: "One composer for everything video. Modes, not tabs.",
    bullets: ["Faceless series with recurring characters", "Swap yourself into viral formats", "Cinematic camera, lighting & film looks", "Product ads from a single photo"],
    featured: true,
  },
  {
    icon: ImageIcon,
    name: "Image",
    tag: "Thumbnails, scenes, characters",
    desc: "Generate and edit by typing. Keep your characters consistent across every scene.",
    bullets: ["Consistent characters", "Edit by prompt", "Upscale to 4K"],
  },
  {
    icon: Mic,
    name: "Voice",
    tag: "Voiceover & lip-sync",
    desc: "Natural voiceovers in seconds, synced to your video. Clone your own voice when you want it to sound like you.",
    bullets: ["Studio-quality TTS", "Lip-sync to any clip", "Voice cloning"],
  },
];

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-28 overflow-hidden py-24">
      <div className="pointer-events-none absolute right-[-10rem] top-20 h-[30rem] w-[30rem] rounded-full bg-primary-deep/20 blur-[120px]" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Everything you need. Nothing you don&apos;t.</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Three tools. One studio.
          </h2>
          <p className="mt-4 text-muted">
            Other AI tools bolt on a new &ldquo;studio&rdquo; every month until you need a map to find the generate button. We kept it to the three things creators actually use.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {pillars.map((p) => (
            <article
              key={p.name}
              className={`relative overflow-hidden rounded-3xl border p-7 ${
                p.featured
                  ? "border-primary/40 bg-gradient-to-b from-primary/10 to-bg-elevated shadow-glow lg:row-span-1"
                  : "border-border bg-bg-elevated"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`grid size-11 place-items-center rounded-2xl ${p.featured ? "bg-primary text-bg" : "bg-primary/10 text-primary"}`}>
                  <p.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted">{p.tag}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted">{p.desc}</p>
              <ul className="mt-5 space-y-2.5">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
