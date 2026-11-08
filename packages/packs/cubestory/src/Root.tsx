import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import example from "../examples/episode_double_coins.spec.json";
import type { VideoSpec } from "./types";

export const Root: React.FC = () => {
  const spec = example as unknown as VideoSpec;
  return (
    <Composition
      id="Main"
      component={Main}
      width={spec.format.width}
      height={spec.format.height}
      fps={spec.format.fps}
      durationInFrames={Math.round((spec.format.duration_ms / 1000) * spec.format.fps)}
      defaultProps={spec}
      calculateMetadata={({ props }) => ({
        width: props.format.width,
        height: props.format.height,
        fps: props.format.fps,
        durationInFrames: Math.round((props.format.duration_ms / 1000) * props.format.fps),
      })}
    />
  );
};
