---
name: asset_library_search
description: "Use when a range or rule needs an asset the user already owns: searches library.json by kind, query, mood, BPM range and duration, returns ranked matches with placement measurements (gain, first onset, bar-aligned loop point). Local only. Next skill: scene_plan_patch or music_select."
kind: script
tag: universal
category: assets
script: node/asset_library_search.mjs
requires: [node>=20]
inputs: "{ project_path | library_path, query?, kind?, mood?, bpm_range?, min_ms?, max_ms?, require_commercial?, limit? }"
outputs: "{ results[], total }"
schema_refs: [asset_library.v1]
---
# asset_library_search

Runs locally: `node toolkit/node/asset_library_search.mjs input.json`. Prefer `require_commercial: true` for anything going into a final render.
