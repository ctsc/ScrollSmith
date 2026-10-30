import { Lightbulb, Wand2, Send } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Type one idea",
    body: "\u201cWhat if the moon was a lamp you could switch on?\u201d Pick a style, choose 1 clip or a 4-episode series.",
  },
  {
    icon: Wand2,
    title: "We make the video",
    body: "Script, scenes, consistent characters, voiceover and captions. One composer picks the best AI model for you.",
  },
  {
    icon: Send,
    title: "Post it",
    body: "Download in 9:16, ready for Reels, TikTok and Shorts. Reuse your characters so your series feels like yours.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-6xl scroll-mt-28 px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">How it works</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
          Idea to posted in three steps
        </h2>
        <p className="mt-4 text-muted">
          No timelines, no plugins, no 20-minute tutorials. If you can type a sentence, you can ship a video.
        </p>
      </div>

      <ol className="mt-14 grid gap-5 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="group relative rounded-3xl border border-border bg-bg-elevated p-7 transition hover:border-primary/40 hover:shadow-glow">
            <div className="flex items-center justify-between">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                <s.icon className="size-5" />
              </span>
              <span className="font-display text-4xl font-semibold text-border transition group-hover:text-primary/40">
                0{i + 1}
              </span>
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
