---
name: retention_score
description: "Use before publishing to get an explainable 0 to 100 heuristic over hook timing, visual change rate, open loops, payoff position, length fit and caption coverage. Do not present it as a prediction of views. Returns the score, per-factor values and notes. Next skill: script_tighten or scene_plan_patch when the notes point at fixes."
kind: script
tag: universal
category: quality
script: node/retention_score.mjs
requires: [node>=20]
inputs: "{ spec_path, script_path?, captions_path? }"
outputs: "{ score, factors, notes[] }"
schema_refs: [video_spec.v1, script.v1, captions.v1]
---
# retention_score

Runs locally: `node toolkit/node/retention_score.mjs input.json`.

Weights (house, not validated against platform data): hook by 3 s 30 percent, visual change rate 20, open loops 15, payoff position 15, length fit 10, caption coverage 10. Each note names a concrete fix. Always tell the user the score is a checklist, not a forecast; suggest they calibrate the weights against their own analytics once they have 20 or more posts.
