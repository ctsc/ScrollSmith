import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InstallTabs } from "@/components/InstallTabs";
import { Mascot } from "@/components/Mascot";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Add the MCP",
  description: `Add ${site.shortName} to Claude, ChatGPT, Gemini CLI or Cursor in under a minute. Free.`,
};

export default function McpPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] bg-grid" />
        <section className="relative mx-auto max-w-3xl px-6 pb-24 pt-36 sm:pt-40">
          <Mascot media="(min-width: 640px)" className="absolute right-6 top-28 hidden w-40 sm:block" />
          <p className="text-sm font-medium text-primary">Add the MCP</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            One link. <span className="gradient-text">Any assistant.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Scrollsmith is a free MCP server. Paste its URL into the AI you already use and it shows up as a connected
            server. Skills for video, image and voice are landing soon. Nothing to download, no account.
          </p>
          <div className="mt-10">
            <InstallTabs />
          </div>
          <p className="mt-6 text-xs text-muted">
            Trouble connecting? Make sure the URL ends in <code className="font-mono">/mcp</code> and
            authentication is set to none. Steps change as the apps update; the URL does not.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
