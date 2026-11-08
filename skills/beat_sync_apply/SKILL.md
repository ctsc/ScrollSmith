---
name: beat_sync_apply
description: "Use after beat_detect when cuts should land on the music grid. Snaps range boundaries to the nearest beat or downbeat within a tolerance, skipping any snap that would make the narration not fit. Do not use before music_select and beat_detect. Returns the new versioned spec path plus snapped and skipped ranges. Next skill: sfx_place or scene_plan_validate."
kind: script
tag: faceless
category: motion
script: node/beat_sync_apply.mjs
requires: [node>=20]
inputs: "{ spec_path, beats_path, mode?: beat|downbeat, tolerance_ms?: 250, wps?, out_path? }"
outputs: "{ spec_path, snapped[], skipped[] }"
schema_refs: [video_spec.v1, beats.v1]
---
# beat_sync_apply

Runs locally: `node toolkit/node/beat_sync_apply.mjs input.json`.

1. Needs `beats.json` from `beat_detect` (local librosa or the ffmpeg onset fallback) and the current spec.
2. For every range boundary after the first, find the nearest beat (or downbeat with `mode: "downbeat"`). Snap when it is within `tolerance_ms` and both neighbouring ranges still fit their narration at the project's words-per-second.
3. Writes the next spec version (`a.v3.json` to `a.v4.json`) with `beat_sync.snap_cuts_to` set on snapped ranges.

Report skipped ranges to the user with the reason. A skipped snap is not an error: narration always wins over the grid. Run `scene_plan_validate` afterwards (rule B1 checks the result).
