"use client";

import { useEffect, useState } from "react";
import { isInstallKey } from "./install-key";

/** Resolves the visitor's install key: from the server-read cookie, else by minting one via /api/key. */
export function useInstallKey(initialKey?: string | null) {
  const [key, setKey] = useState<string | null>(initialKey ?? null);
  useEffect(() => {
    if (key) return;
    const ctrl = new AbortController();
    fetch("/api/key", { method: "POST", signal: ctrl.signal })
      .then((r) => r.json())
      .then((d: { key?: unknown }) => {
        if (isInstallKey(d.key)) setKey(d.key);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [key]);
  return key;
}
