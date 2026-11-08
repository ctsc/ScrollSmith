---
name: jump_cut_pace
description: "Use to enforce a maximum shot length and visual-change cadence on talking-head footage with A/B crop alternation on each cut, within the style's cuts per minute. Next skill: scene_plan_validate."
kind: script
tag: talking_head
category: footage
script: node/apply_decisions.mjs
requires: [node>=20]
inputs: "{ spec_path, words_path, max_shot_ms?: 4000, change_every_ms?: 3000 }"
outputs: "new spec version; decision_log"
schema_refs: [video_spec.v1]
---
# jump_cut_pace
`apply_decisions` with `cut_pacing.max_shot_length`, `cut_pacing.cut_on_sentence_boundary` and `zoom_framing.alternate_crop_ab`. Cuts land on word boundaries only (F1).
