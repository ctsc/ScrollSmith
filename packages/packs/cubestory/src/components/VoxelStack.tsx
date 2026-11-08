import React, { useMemo } from "react";
import { useVideoConfig } from "remotion";
import { useThree } from "@react-three/fiber";
import type { Layer } from "../types";
import { findAnim, progress, useLocalMs, easeOutBack } from "../anim";

type Props = { layer: Layer; rangeStartMs: number; tokens: { color: Record<string, string>; motion: Record<string, number>; beat: Record<string, number> }; camera?: string };

type Arrangement = "tower" | "pyramid" | "grid" | "spiral";

export function positions(count: number, arrangement: Arrangement): [number, number, number][] {
  const out: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    if (arrangement === "tower") out.push([0, i + 0.5, 0]);
    else if (arrangement === "grid") out.push([(i % 4) - 1.5, 0.5, Math.floor(i / 4) - 1.5]);
    else if (arrangement === "spiral") {
      const a = i * 0.6;
      out.push([Math.cos(a) * (1 + i * 0.08), i * 0.35 + 0.5, Math.sin(a) * (1 + i * 0.08)]);
    } else {
      let level = 0, used = 0;
      while (used + (level + 1) ** 2 <= i) used += (level + 1) ** 2, level++;
      const side = level + 1, k = i - used;
      const top = Math.ceil(Math.sqrt(count)) - level;
      out.push([(k % side) - (side - 1) / 2, top + 0.5, Math.floor(k / side) - (side - 1) / 2]);
    }
  }
  return out;
}

/** State at a given local ms: number of visible cubes. Used by loop_seal (state_match). */
export function getLoopState(layer: Layer, tMs: number, fps: number) {
  const count = Number(layer.props?.count ?? 1);
  const spawn = findAnim(layer, "voxel_spawn_stagger");
  const stagger = Number(spawn?.params?.stagger_ms ?? 40);
  if (!spawn) return { visible: count };
  const elapsed = tMs - spawn.start_ms;
  return { visible: Math.max(0, Math.min(count, Math.floor(elapsed / stagger) + 1)) };
}

export const VoxelStack: React.FC<Props> = ({ layer, tokens, camera }) => {
  const t = useLocalMs();
  const { fps } = useVideoConfig();
  const count = Number(layer.props?.count ?? 1);
  const arrangement = (layer.props?.arrangement as Arrangement) ?? "tower";
  const color = (layer.props?.color as string) ?? tokens.color.primary;
  const spawn = findAnim(layer, "voxel_spawn_stagger");
  const stagger = Number(spawn?.params?.stagger_ms ?? tokens.motion.spawn_stagger_ms ?? 40);
  const pts = useMemo(() => positions(count, arrangement), [count, arrangement]);
  const { camera: cam } = useThree();
  const orbit = findAnim(layer, "camera_orbit");
  const pull = findAnim(layer, "camera_pullout");
  const height = Math.max(3, Math.max(...pts.map((p) => p[1])) + 2);
  const angle = orbit ? progress(orbit, t, fps) * Math.PI * 0.5 : 0.6;
  const dist = (camera === "low_angle" ? 0.9 : 1.2) * height * (pull ? 1 + progress(pull, t, fps) * 0.8 : 1.4);
  cam.position.set(Math.cos(angle) * dist, camera === "top_down" ? height * 1.6 : height * 0.75, Math.sin(angle) * dist);
  cam.lookAt(0, height / 2.5, 0);
  const beat = findAnim(layer, "beat_pulse");
  const pulse = beat ? 1 + (tokens.beat.pulse_scale - 1) * (1 - progress(beat, t, fps)) : 1;
  return (
    <group scale={pulse}>
      {pts.map((p, i) => {
        const born = spawn ? spawn.start_ms + i * stagger : -1;
        if (born > t) return null;
        const s = spawn ? easeOutBack(Math.min(1, (t - born) / 220)) : 1;
        return (
          <mesh key={i} position={[p[0], p[1] * s + (1 - s) * (p[1] + 0.5), p[2]]} scale={Math.max(0.001, s)} castShadow>
            <boxGeometry args={[0.96, 0.96, 0.96]} />
            <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} />
          </mesh>
        );
      })}
    </group>
  );
};
