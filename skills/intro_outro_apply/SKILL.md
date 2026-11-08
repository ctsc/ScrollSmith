---
name: intro_outro_apply
description: "Use on branded videos to add an intro (max 1.5 s), outro or end card from the brand kit. Default off for short-form because intros eat hook time. Next skill: scene_plan_validate."
kind: script
tag: branded
category: design
script: node/scene_plan_patch.mjs
requires: [node>=20]
inputs: "{ spec_path, brand_kit_path, intro?: false, outro?: true }"
outputs: "new spec version with intro/outro ranges"
schema_refs: [video_spec.v1, brand_kit.v1]
---
# intro_outro_apply
Insert ranges via `scene_plan_patch`; when an intro is added the hook range must still end by 3 s (T2), so the intro is a 0.8 to 1.5 s overlay on the hook, not before it.
