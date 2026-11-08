import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import type { VideoSpec, Range } from "./types";
import { tokensFor } from "./tokens";
import { VoxelStack } from "./components/VoxelStack";
import { Ground } from "./components/Ground";
import { ValueHUD } from "./components/ValueHUD";
import { DayBadge } from "./components/DayBadge";
import { HookTitle } from "./components/HookTitle";
import { Captions } from "./components/Captions";

const msToFrames = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

const RangeView: React.FC<{ range: Range; spec: VideoSpec }> = ({ range, spec }) => {
  const { width, height } = useVideoConfig();
  const t = tokensFor(spec);
  const scene = range.layers.filter((l) => l.kind === "scene3d");
  const dom = range.layers.filter((l) => l.kind !== "scene3d");
  return (
    <AbsoluteFill style={{ background: t.color.bg }}>
      {scene.length > 0 && (
        <ThreeCanvas width={width} height={height} camera={{ position: [6, 7, 10], fov: 40 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
          {scene.map((l) =>
            l.component === "cubestory.VoxelStack" ? (
              <VoxelStack key={l.id} layer={l} rangeStartMs={range.start_ms} tokens={t} camera={range.camera?.preset} />
            ) : l.component === "cubestory.Ground" ? (
              <Ground key={l.id} tokens={t} />
            ) : null,
          )}
        </ThreeCanvas>
      )}
      {dom.map((l) => {
        const common = { key: l.id, layer: l, rangeStartMs: range.start_ms, tokens: t };
        switch (l.component) {
          case "cubestory.ValueHUD":
            return <ValueHUD {...common} />;
          case "cubestory.DayBadge":
            return <DayBadge {...common} />;
          case "cubestory.HookTitle":
            return <HookTitle {...common} />;
          default:
            return null;
        }
      })}
    </AbsoluteFill>
  );
};

export const Main: React.FC<VideoSpec> = (spec) => {
  const { fps } = useVideoConfig();
  const t = tokensFor(spec);
  return (
    <AbsoluteFill style={{ background: t.color.bg, fontFamily: t.type.body }}>
      {spec.timeline.map((r) => (
        <Sequence key={r.id} from={msToFrames(r.start_ms, fps)} durationInFrames={Math.max(1, msToFrames(r.end_ms - r.start_ms, fps))} name={r.id}>
          <RangeView range={r} spec={spec} />
        </Sequence>
      ))}
      {spec.captions?.pages && <Captions pages={spec.captions.pages} preset={spec.captions.preset ?? "cube_pop_3word"} tokens={t} />}
    </AbsoluteFill>
  );
};
