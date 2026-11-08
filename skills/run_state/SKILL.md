---
name: run_state
description: "Use at the start of a recipe and after each step to keep a resumable local run.v1 record (runs/<run_id>/run.json): started steps, input hashes, outputs and status, so a rerun skips completed steps with identical inputs. Next skill: whatever the recipe says next."
kind: script
tag: universal
category: orchestration
script: node/run_state.mjs
requires: [node>=20]
inputs: "{ action: start|begin|finish|status, project_path, recipe_id?, run_id?, step?, inputs?, status?, outputs? }"
outputs: "run.json (run.v1) or { skip: true, reason } when a step is already complete"
schema_refs: [run.v1]
---
# run_state

Runs locally: `node toolkit/node/run_state.mjs input.json`. Call `start` once per recipe run, `begin` before each step (it returns `skip: true` when the same inputs already finished), `finish` after. Keep `run_id` in the conversation so the user can resume later by name.
