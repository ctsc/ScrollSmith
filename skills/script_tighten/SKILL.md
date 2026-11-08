---
name: script_tighten
description: "Use when a script is too long, slow or vague. Cuts filler, merges lines without a retention purpose, strengthens verbs and re-estimates duration. Do not use to change the idea. Returns the new script version and a diff summary. Next skill: scene_plan_create."
kind: instruction
tag: universal
category: script
inputs: "script.v1, target_s, duration_estimate output"
outputs: "script.v1 (new version) plus { removed_lines, merged_lines, est_duration_ms }"
schema_refs: [script.v1]
---
# script_tighten

Every line must do one of: open a loop, escalate, pay off, or call to action. Cut anything else. Prefer deleting over compressing. Re-run `duration_estimate` and stop when the estimate is within 10 percent of the target. Keep emphasis words and loop ids consistent.
