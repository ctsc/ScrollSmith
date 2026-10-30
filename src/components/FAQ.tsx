import { site } from "@/config/site";

const faqs = [
  {
    q: "Is it free?",
    a: "Creating an account is free. Early-access members get free starter credits. After that, simple monthly plans starting at $15 for people exploring, with bigger plans for serious creators.",
  },
  {
    q: "Who is it for?",
    a: "Faceless and short-form creators on Instagram Reels, TikTok and YouTube Shorts. If you post vertical video, this is built for you.",
  },
  {
    q: "Do I need any editing experience?",
    a: "No. You type an idea, choose a style, and get a finished 9:16 video with voiceover and captions. Light trimming and stitching is built in if you want it.",
  },
  {
    q: "Which AI models do you use?",
    a: "The best current video, image and voice models, all behind one composer. You never have to pick between them unless you want to.",
  },
  {
    q: "What about safety?",
    a: `${site.name} is 18+, NSFW content is blocked, and face-swap features only work with AI characters or your own uploaded likeness.`,
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-28 px-6 py-24">
      <div className="text-center">
        <p className="text-sm font-medium text-primary">FAQ</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Questions, answered</h2>
      </div>
      <div className="mt-12 divide-y divide-border rounded-3xl border border-border bg-bg-elevated">
        {faqs.map((f) => (
          <details key={f.q} className="group px-6 py-5 open:bg-surface/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {f.q}
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border text-muted transition group-open:rotate-45 group-open:border-primary group-open:text-primary">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
