import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

type Page = { text: string; startMs: number; endMs: number; tokens?: { text: string; fromMs: number; toMs: number }[] };
type Props = { pages: Page[]; preset: string; tokens: { color: Record<string, string>; type: Record<string, string>; size: Record<string, number>; stroke: Record<string, number> } };

/** Captions sit at 68% height: inside universal_relaxed, below the 3D subject, above the platform UI band. */
export const Captions: React.FC<Props> = ({ pages, preset, tokens }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const page = pages.find((p) => ms >= p.startMs && ms < p.endMs);
  if (!page) return null;
  const age = ms - page.startMs;
  const pop = preset === "cube_pop_3word" ? Math.min(1, age / 120) : 1;
  const scale = 1 + 0.12 * (1 - pop);
  return (
    <div
      style={{
        position: "absolute",
        top: "68%",
        left: "6%",
        right: "6%",
        textAlign: "center",
        transform: `scale(${scale})`,
        fontFamily: tokens.type.display,
        fontSize: tokens.size.caption_px,
        color: tokens.color.primary,
        WebkitTextStroke: `${tokens.stroke.caption_outline_px}px #000`,
        paintOrder: "stroke fill",
        textTransform: "uppercase",
      }}
    >
      {preset === "cube_karaoke" && page.tokens
        ? page.tokens.map((tk, i) => (
            <span key={i} style={{ color: ms >= tk.fromMs ? tokens.color.primary : tokens.color.text }}>
              {tk.text}
            </span>
          ))
        : page.text}
    </div>
  );
};
