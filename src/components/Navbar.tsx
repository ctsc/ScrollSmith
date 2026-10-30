import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "./Logo";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl glass px-4 py-2.5 sm:px-5 mx-4 lg:mx-auto">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#how" className="transition hover:text-fg">How it works</a>
          <a href="#features" className="transition hover:text-fg">Features</a>
          <a href="#faq" className="transition hover:text-fg">FAQ</a>
        </nav>
        <a
          href="#waitlist"
          className="group inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-bg transition hover:bg-white sm:px-4"
        >
          Get early access
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </a>
      </div>
    </header>
  );
}
