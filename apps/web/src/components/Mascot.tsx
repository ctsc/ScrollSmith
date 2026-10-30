"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

const MascotCanvas = dynamic(() => import("./MascotCanvas"), { ssr: false });

function useMedia(query: string | undefined) {
  return useSyncExternalStore(
    (cb) => {
      if (!query) return () => {};
      const mq = matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => (query ? matchMedia(query).matches : true),
    () => false,
  );
}

/**
 * Smith, the Scrollsmith mascot: a floating low-poly gem that watches the cursor.
 * `media` mounts the WebGL canvas only when the query matches so a page can place
 * one mascot per breakpoint without paying for two contexts.
 */
export function Mascot({ className, media }: { className?: string; media?: string }) {
  const on = useMedia(media);
  return <div className={className} aria-hidden="true">{on && <MascotCanvas />}</div>;
}
