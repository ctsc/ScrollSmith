import { site } from "@/config/site";

const faqs = [
  {
    q: "What is an MCP?",
    a: "A small add-on that gives an AI assistant new tools. Add Scrollsmith to Claude, ChatGPT, Gemini CLI or Cursor and it can plan, script and assemble faceless videos, images and voiceovers for you from a normal chat message.",
  },
  {
    q: "Is it free?",
    a: "Yes, Scrollsmith is completely free. You just need an AI assistant that supports MCP, like Claude, ChatGPT, Gemini or Cursor.",
  },
  {
    q: "Who is it for?",
    a: "Faceless and short-form creators on Instagram Reels, TikTok and YouTube Shorts. If you post vertical video, this is built for you.",
  },
  {
    q: "Do I need any editing experience?",
    a: "No. You describe the idea to your AI, it uses Scrollsmith to make a finished 9:16 video with voiceover and captions, and you post it.",
  },
  {
    q: "Which AI models make the videos?",
    a: "The ones your assistant already has. Scrollsmith is a library of skills, not a model: it never calls video, image or voice models itself, so there is nothing to pay for and nothing new to sign up for.",
  },
  {
    q: "Why is my URL different from my friend's?",
    a: "Each visitor gets an anonymous install key baked into the URL. It lets us count how many creators use Scrollsmith without accounts or emails. It is not tied to your name, and you can clear it by clearing your cookies.",
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
