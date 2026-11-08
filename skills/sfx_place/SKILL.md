---
name: sfx_place
description: "Use after music is chosen to add whooshes, pops, clicks, risers and impacts from the user's own SFX library on transitions, text-ins, counters, zoom punches and the pre-payoff moment. Do not use to download sounds (see get_asset_sources). Returns placements and roles with no matching asset. Next skill: captions_build."
kind: script
tag: universal
category: audio
script: node/sfx_place.mjs
requires: [node>=20]
inputs: "{ spec_path, project_path | library_path, min_spacing_ms?: 300, gain_db?: -9, words_path?, out_path? }"
outputs: "{ spec_path, placed[], missing_roles[] }"
schema_refs: [video_spec.v1, asset_library.v1]
---
# sfx_place

Runs locally: `node toolkit/node/sfx_place.mjs input.json`.

Rule table (house defaults): whoosh on any non-cut transition, pop on text and HUD entries, click on counter ticks, impact on `zoom_punch` animations, riser 1.2 s before a `payoff` range. Gain -9 dB (riser -12 dB), at least 300 ms between sounds, never within 150 ms of an emphasis word when `words_path` is given.

Assets come only from `assets/library.json` (run `asset_library_index` or `asset_register` first). Commercially cleared sounds are preferred; the asset is added to `spec.assets` with its license so rule A1 can check it. `missing_roles` lists roles the library cannot cover: tell the user which free sources (`get_asset_sources sfx`) to download from rather than skipping silently.
