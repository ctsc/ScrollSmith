import React from "react";
import { useVideoConfig } from "remotion";
import type { Layer } from "../types";
import { findAnim, progress, useLocalMs } from "../anim";

type Props = { layer: Layer; rangeStartMs: number; tokens: { color: Record<string, string>; type: Record<string, string>; size: Record<string, number>; space: Record<string, number> } };

export function formatValue(v: number, format: string, unit?: string) {
  let s: string;
  if (format === "currency") s = "$" + Math.round(v).toLocaleString("en-US");
  else if (format === "compact") s = Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(Math.round(v));
  else s = Math.round(v).toLocaleString("en-US");
  return unit ? `${s} ${unit}` : s;
}

export const ValueHUD: React.FC<Props> = ({ layer, tokens }) => {
  const t = useLocalMs();
  const { fps } = useVideoConfig();
  const roll = findAnim(layer, "number_roll");
  const from = Number(roll?.params?.from ?? layer.props?.from ?? 0);
  const to = Number(roll?.params?.to ?? layer.props?.to ?? from);
  const p = progress(roll, t, fps);
  const eased = 1 - Math.pow(1 - p, 3);
  const value = from + (to - from) * eased;
  const format = String(roll?.params?.format ?? layer.props?.format ?? "compact");
  return (
    <div
      style={{
        position: "absolute",
        top: "12%",
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: tokens.type.hud,
        fontSize: tokens.size.hud_px,
        color: tokens.color.hud,
        textShadow: "0 6px 0 rgba(0,0,0,0.6)",
        letterSpacing: 2,
        padding: tokens.space.slot_padding_px,
      }}
    >
      {formatValue(value, format, layer.props?.unit as string | undefined)}
    </div>
  );
};
