import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Animation, Layer } from "./types";

export const useLocalMs = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (frame / fps) * 1000;
};

export function findAnim(layer: Layer, primitive: string): Animation | undefined {
  return layer.animations?.find((a) => a.primitive === primitive);
}

/** Progress 0..1 of an animation at local time t (ms since range start), eased with a spring when springy is set. */
export function progress(anim: Animation | undefined, t: number, fps: number, springy = false): number {
  if (!anim) return 1;
  const raw = interpolate(t, [anim.start_ms, anim.start_ms + anim.duration_ms], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (!springy) return raw;
  return spring({ frame: raw * anim.duration_ms * (fps / 1000), fps, durationInFrames: Math.max(1, (anim.duration_ms / 1000) * fps), config: { damping: 12, stiffness: 120 } });
}

export const easeOutBack = (x: number) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
