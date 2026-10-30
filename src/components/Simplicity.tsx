import { Check, Clapperboard, ImageIcon, Mic } from "lucide-react";

const agents = [
  { icon: Clapperboard, name: "Video", modes: ["Faceless series", "Person swap", "Cinematic", "Product ads"] },
  { icon: ImageIcon, name: "Image", modes: ["Thumbnails", "Scenes", "Characters", "Edit by prompt"] },
  { icon: Mic, name: "Voice", modes: ["Voiceover", "Lip-sync", "Voice clone", "Languages"] },
];

const points = [
  "No new app. Paste one link into Claude, ChatGPT or Gemini and you're set.",
  "Just describe the video. Your AI picks the right tool and does the rest.",
  "Completely free. You only need the AI subscription you already have.",
];

export function Simplicity() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid items-center gap-10 rounded-[2rem] border border-border bg-bg-elevated p-8 sm:p-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">We focus on simplicity.</h2>
          <p className="mt-4 text-muted">
            Everything is built into three tools your AI already knows how to use, so anything you want to do with video, image or voice is one message away. Describe the idea, get the clip, post it.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {points.map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4">
          {agents.map((a) => (
            <div key={a.name} className="flex items-center gap-4 rounded-2xl border border-primary/40 bg-primary/10 p-4 shadow-glow sm:p-5">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-bg">
                <a.icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold">{a.name}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {a.modes.map((m) => (
                    <span key={m} className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs text-muted">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
