import React from "react";
import { useVideoConfig } from "remotion";
import type { Layer } from "../types";
import { findAnim, progress, useLocalMs, easeOutBack } from "../anim";

type Props = { layer: Layer; rangeStartMs: number; tokens: { color: Record<string, string>; type: Record<string, string>; size: Record<string, number> } };

export const DayBadge: React.FC<Props> = ({ layer, tokens }) => {
  const t = useLocalMs();
  const { fps } = useVideoConfig();
  const pop = findAnim(layer, "pop_in");
  const s = easeOutBack(progress(pop, t, fps));
  return (
    <div
      style={{
        position: "absolute",
        top: "6%",
        left: "50%",
        transform: `translateX(-50%) scale(${Math.max(0.001, s)})`,
        background: tokens.color.secondary,
        color: tokens.color.text,
        fontFamily: tokens.type.display,
        fontSize: tokens.size.title_px * 0.6,
        padding: "8px 32px",
      }}
    >
      DAY {String(layer.props?.day ?? 1)}
    </div>
  );
};
