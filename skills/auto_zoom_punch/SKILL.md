---
name: auto_zoom_punch
description: "Use on talking-head edits for punch-ins on emphasis words and sentence starts: scale 1.08 to 1.25 for 250 to 400 ms, capped per minute, never in the first or last 300 ms of a shot, face kept inside the safe zone. Produces decisions for apply_decisions. Next skill: edit_plan_create."
kind: script
tag: talking_head
category: footage
script: node/apply_decisions.mjs
requires: [node>=20]
inputs: "{ spec_path, words_path, scale?: 1.15, ms?: 300, max_per_min?: 8 }"
outputs: "new spec version with zoom animations; decision_log"
schema_refs: [video_spec.v1, words.v1]
---
# auto_zoom_punch
Run `apply_decisions` with `zoom_framing.punch_on_emphasis_word` and `zoom_framing.punch_on_sentence_start` from the registry; parameters above. Validate F3 afterwards.
