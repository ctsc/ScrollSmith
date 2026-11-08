---
name: music_select
description: "Use when a spec needs a music bed: searches the user's local library (asset_library.v1) by mood, BPM range, duration and platform, skips tracks without commercial clearance or with high Content ID risk, and writes the pick with placement measurements into the spec. Never downloads music; see get_asset_sources music for where the user can get tracks. Next skill: beat_detect."
kind: script
tag: universal
category: audio
script: node/music_select.mjs
requires: [node>=20]
inputs: "{ spec_path, project_path | library_path, mood?, bpm_range?: [min,max], platform?, out_path? }"
outputs: "{ spec_path, pick: { id, path, bpm, gain_db, first_onset_ms, loop_point_ms }, warnings[] }"
schema_refs: [video_spec.v1, asset_library.v1]
---
# music_select

Runs locally: `node toolkit/node/music_select.mjs input.json`. For YouTube Shorts prefer tracks the user downloaded from the YouTube Audio Library (lowest Content ID risk, rule A2). Unknown license is a warning here and a blocker at `render_final`. Report the pick and the two runners-up so the user can swap.
