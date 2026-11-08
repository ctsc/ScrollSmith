---
name: brand_kit_apply
description: "Use when a spec should use the brand's colors, fonts and logo instead of the pack defaults: writes a token_overrides patch and re-checks contrast (L1). Next skill: scene_plan_validate."
kind: script
tag: branded
category: design
script: node/scene_plan_patch.mjs
requires: [node>=20]
inputs: "{ spec_path, brand_kit_path }"
outputs: "new spec version with style.token_overrides"
schema_refs: [video_spec.v1, brand_kit.v1]
---
# brand_kit_apply
Build RFC 6902 ops that set `style.token_overrides` (palette, fonts, logo asset id, caption preset) from the brand kit and apply with `scene_plan_patch`. Run `scene_plan_validate` and fix any L1 contrast warning by adjusting the text color, not the brand color.
