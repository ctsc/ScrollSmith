import { site } from "@/config/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-deep shadow-glow">
        <svg viewBox="0 0 24 24" className="size-4 fill-bg" aria-hidden>
          <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">{site.shortName}</span>
    </span>
  );
}
