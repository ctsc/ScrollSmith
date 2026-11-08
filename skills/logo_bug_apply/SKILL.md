---
name: logo_bug_apply
description: "Use to add a persistent logo or handle in a safe-zone corner from the brand kit. Never other apps' logos or watermarks. Next skill: scene_plan_validate."
kind: script
tag: branded
category: design
script: node/scene_plan_patch.mjs
requires: [node>=20]
inputs: "{ spec_path, brand_kit_path, position: tl|tr|bl|br }"
outputs: "new spec version with a global logo layer"
schema_refs: [video_spec.v1, brand_kit.v1]
---
# logo_bug_apply
Default top-left, 7 percent width, 60 percent opacity, inside `universal_strict`. Reels penalizes visible third-party watermarks; your own logo is fine.
