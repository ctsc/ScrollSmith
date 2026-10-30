import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 text-sm text-muted sm:flex-row">
        <Logo />
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href="#features" className="transition hover:text-fg">Features</a>
          <a href="#faq" className="transition hover:text-fg">FAQ</a>
          <Link href="/mcp" className="transition hover:text-fg">Add the MCP</Link>
          <Link href="/terms" className="transition hover:text-fg">Terms</Link>
          <Link href="/privacy" className="transition hover:text-fg">Privacy</Link>
          <a href={site.social.instagram} target="_blank" rel="noreferrer" className="transition hover:text-fg">Instagram</a>
          <a href={site.social.tiktok} target="_blank" rel="noreferrer" className="transition hover:text-fg">TikTok</a>
        </nav>
        <p className="text-xs">&copy; 2026 {site.name}. 18+ only.</p>
      </div>
    </footer>
  );
}
