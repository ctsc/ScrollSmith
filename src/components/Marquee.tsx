import { PhoneCard, scenes } from "./PhoneCard";

export function Marquee() {
  const items = [...scenes, ...scenes];
  return (
    <section aria-label="Example videos" className="relative overflow-hidden py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />
      <div className="flex w-max gap-4 animate-marquee">
        {items.map((s, i) => (
          <PhoneCard key={`${s.title}-${i}`} scene={s} className="w-36 sm:w-40" />
        ))}
      </div>
    </section>
  );
}
