import React from "react";
import { useVideoConfig } from "remotion";
import type { Layer } from "../types";
import { findAnim, progress, useLocalMs } from "../anim";

type Props = { layer: Layer; rangeStartMs: number; tokens: { color: Record<string, string>; type: Record<string, string>; size: Record<string, number>; stroke: Record<string, number> } };

export const HookTitle: React.FC<Props> = ({ layer, tokens }) => {
  const t = useLocalMs();
  const { fps } = useVideoConfig();
  const slam = findAnim(layer, "word_slam") ?? findAnim(layer, "pop_in");
  const p = progress(slam, t, fps);
  const scale = 1.6 - 0.6 * (1 - Math.pow(1 - p, 3));
  const text = (layer.props?.text as string) ?? layer.text ?? "";
  return (
    <div
      style={{
        position: "absolute",
        top: "18%",
        left: "8%",
        right: "8%",
        textAlign: "center",
        transform: `scale(${scale})`,
        opacity: p,
        fontFamily: tokens.type.display,
        fontSize: tokens.size.title_px,
        lineHeight: 1.05,
        color: tokens.color.text,
        WebkitTextStroke: `${tokens.stroke.caption_outline_px}px #000`,
        paintOrder: "stroke fill",
      }}
    >
      {text}
    </div>
  );
};
