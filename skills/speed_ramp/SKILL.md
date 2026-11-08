---
name: speed_ramp
description: "Use to time-remap a range (speed up idle, slow a reveal) with a curve; audio pitch is preserved or muted. Next skill: scene_plan_validate."
kind: script
tag: universal
category: motion
script: node/scene_plan_patch.mjs
requires: [node>=20]
inputs: "{ spec_path, range_id, curve: [{ t, speed }] }"
outputs: "new spec version with a speed effect on the range"
schema_refs: [video_spec.v1]
---
# speed_ramp
Patch the range's footage layer with `speed` keyframes; render maps to ffmpeg `setpts` plus `atempo` (or mute above 2x).
