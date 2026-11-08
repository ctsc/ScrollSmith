---
name: originality_check
description: "Use before render_final on a series channel to compare the script and structure with the last 20 episodes in history/episodes.json. Flags near-duplicate text (3-gram cosine 0.9 or more), identical beat and layout sequences and variation axes repeated 3 or more times. Also records an episode after render with action record. Next skill: policy_check."
kind: script
tag: faceless
category: quality
script: node/originality_check.mjs
requires: [node>=20]
inputs: "{ spec_path, script_path?, project_path | history_path, last_n?: 20, text_threshold?: 0.9 } or { action: record, spec_path, script_path?, project_path }"
outputs: "{ pass, similarity, repeated_axes[], fix_hints[] } or { history_path, episodes }"
schema_refs: [video_spec.v1, script.v1]
---
# originality_check

Runs locally: `node toolkit/node/originality_check.mjs input.json`.

Two calls per episode: check before the final render, then `action: "record"` after it so the next episode compares against this one. History stays in the project folder; nothing is sent anywhere. When it fails, apply the `fix_hints` (rewrite hook and payoff lines, change a layout, run `variation_pick` for the repeated axes) and re-run. Platforms penalize unoriginal and repetitive content (YouTube and Instagram guidance), so treat a fail as blocking for series channels.
