---
name: recipe_run
description: "Use when the user asks for an end-to-end video: fetches the recipe (get_recipe), starts run_state, then executes each skill in order with get_skill, stopping at every checkpoint for approval and reporting progress as a short table. Use this instead of improvising a chain. Next skill: as the recipe dictates."
kind: instruction
tag: universal
category: orchestration
inputs: "recipe id, recipe args, project_path"
outputs: "Completed recipe with artifacts listed; run.json"
schema_refs: [run.v1]
---
# recipe_run

1. `get_recipe <id>`; confirm args with the user in one message.
2. `run_state start`. For each step: `run_state begin`; if not skipped, `get_skill <step>` and follow it; `run_state finish` with outputs.
3. Checkpoints block until the user answers. Errors in `error.v1` form: show `fix_hint`, fix, retry once, then ask.
4. End with the export manifest path and `publish_checklist`.
