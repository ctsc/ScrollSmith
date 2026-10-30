"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { CopyButton } from "./CopyButton";
import { track, type McpClient } from "@/lib/track";

type Client = {
  id: McpClient;
  name: string;
  note: string;
  steps: string[];
  snippet?: { label: string; code: string };
  link?: { label: string; href: string };
};

const url = site.mcpUrl;
const cursorConfig = typeof btoa === "function" ? btoa(JSON.stringify({ url })) : "";

const clients: Client[] = [
  {
    id: "claude",
    name: "Claude",
    note: "Claude web, desktop and Claude Code.",
    steps: [
      "Open Claude → Settings → Connectors.",
      "Click Add custom connector.",
      "Name it Scrollsmith, paste the URL below, click Add.",
      "Start a new chat and ask Claude to “check Scrollsmith status”.",
    ],
    snippet: {
      label: "Claude Code (terminal)",
      code: `claude mcp add --transport http scrollsmith ${url}`,
    },
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    note: "Needs a paid ChatGPT plan with developer mode.",
    steps: [
      "Open ChatGPT → Settings → Connectors → Advanced → turn on Developer mode.",
      "Back in Connectors, click Create.",
      "Name it Scrollsmith, paste the URL below, set authentication to None, click Create.",
      "In a new chat, open the + menu, enable Scrollsmith under Developer mode and say hi.",
    ],
  },
  {
    id: "gemini",
    name: "Gemini CLI",
    note: "The Gemini app does not take custom MCP servers yet; Gemini CLI does.",
    steps: [
      "Install Gemini CLI if you have not: npm install -g @google/gemini-cli.",
      "Run the command below once.",
      "Start gemini and type /mcp to confirm Scrollsmith is listed.",
    ],
    snippet: {
      label: "Terminal",
      code: `gemini mcp add --transport http scrollsmith ${url}`,
    },
  },
  {
    id: "cursor",
    name: "Cursor",
    note: "For creators who already work in a code editor.",
    steps: [
      "Click Add to Cursor below and confirm the install dialog.",
      "Or add the snippet to .cursor/mcp.json in your project.",
      "Open Cursor Settings → MCP to confirm it shows green.",
    ],
    snippet: {
      label: ".cursor/mcp.json",
      code: `{\n  "mcpServers": {\n    "scrollsmith": { "url": "${url}" }\n  }\n}`,
    },
    link: {
      label: "Add to Cursor",
      href: `cursor://anysphere.cursor-deeplink/mcp/install?name=scrollsmith&config=${cursorConfig}`,
    },
  },
];

export function InstallTabs() {
  const [active, setActive] = useState(clients[0].id);
  const client = clients.find((c) => c.id === active) ?? clients[0];

  return (
    <div className="rounded-3xl border border-border bg-bg-elevated shadow-glow">
      <div className="flex flex-wrap gap-1 border-b border-border p-2" role="tablist">
        {clients.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={c.id === active}
            onClick={() => {
              setActive(c.id);
              track("install_tab", c.id);
            }}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
              c.id === active ? "bg-primary text-bg" : "text-muted hover:bg-surface hover:text-fg"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        <p className="text-sm text-muted">{client.note}</p>

        <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-bg px-4 py-3">
          <code className="min-w-0 flex-1 truncate font-mono text-sm text-primary">{url}</code>
          <CopyButton text={url} label="Copy URL" onCopied={() => track("copy_mcp_url", client.id)} />
        </div>

        <ol className="mt-6 space-y-3">
          {client.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed">
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-primary/40 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <span className="text-fg/90">{step}</span>
            </li>
          ))}
        </ol>

        {client.snippet && (
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">{client.snippet.label}</p>
              <CopyButton text={client.snippet.code} onCopied={() => track("copy_snippet", client.id)} />
            </div>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-border bg-bg p-4 font-mono text-xs leading-relaxed text-fg/90">
              {client.snippet.code}
            </pre>
          </div>
        )}

        {client.link && (
          <a
            href={client.link.href}
            onClick={() => track("cursor_deeplink", client.id)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-bg transition hover:bg-white"
          >
            {client.link.label}
          </a>
        )}
      </div>
    </div>
  );
}
