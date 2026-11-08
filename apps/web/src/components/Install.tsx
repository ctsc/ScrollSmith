import { Suspense } from "react";
import { cookies } from "next/headers";
import { InstallTabs } from "./InstallTabs";
import { INSTALL_KEY_COOKIE, isInstallKey } from "@/lib/install-key";

async function KeyedTabs() {
  const key = (await cookies()).get(INSTALL_KEY_COOKIE)?.value;
  return <InstallTabs initialKey={isInstallKey(key) ? key : null} />;
}

export function Install() {
  return (
    <section id="install" className="relative mx-auto max-w-3xl scroll-mt-28 px-6 pb-20 pt-36 sm:pt-40">
      <p className="text-sm font-medium text-primary">Free MCP for faceless short-form video</p>
      <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        One link. <span className="gradient-text">Any assistant.</span>
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Scrollsmith is a free MCP server. Paste its URL into the AI you already use and it shows up as a connected
        server. 139 skills for faceless video, talking-head edits, strategy, hooks and review, served to your own assistant, which runs everything locally. Nothing to download, no account.
      </p>
      <div className="mt-10">
        <Suspense fallback={<InstallTabs />}>
          <KeyedTabs />
        </Suspense>
      </div>
      <p className="mt-6 text-xs text-muted">
        Trouble connecting? Make sure you pasted the full URL and authentication is set to none. Steps change as the
        apps update; the URL does not.
      </p>
    </section>
  );
}
