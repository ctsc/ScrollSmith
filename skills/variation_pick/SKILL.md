---
name: variation_pick
description: "Use before scene_plan_create for every new episode of a series, to choose palette, camera and other variation axes so episodes do not look mass-produced. Do not use for one-off videos without a series. Returns seeded picks that avoid the last N episodes. Next skill: scene_plan_create."
kind: script
tag: faceless
category: design
requires: [node>=20]
script: "toolkit/node/variation_pick.mjs"
inputs: "{ pack_manifest_path | pack_manifest, history_path?, seed, avoid_last?: 3 }"
outputs: "{ seed, picks: {axis: value}, avoided: {axis: [values]} }"
schema_refs: [style_pack.v1]
---

# variation_pick

Seeded PRNG (mulberry32) over the style pack's `variation_axes`, excluding values used in the last N episodes recorded in `history/episodes.json`. This is the main lever against the "repetitive content" and "originality" platform policies.

## Run
`node toolkit/node/variation_pick.mjs '{"pack_manifest_path": "packs/cubestory/manifest.json", "history_path": "history/episodes.json", "seed": 1042}'`

## Rules
- Use the episode seed (`meta.seed`) so the pick is reproducible.
- Write the picks into `style.variation` of the spec and record them in `history/episodes.json` after the render so the next episode avoids them.
- If a pack has no `variation_values` for an axis, the palette variants from `tokens.palette_variants` are used.
