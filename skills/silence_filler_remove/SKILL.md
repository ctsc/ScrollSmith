---
name: silence_filler_remove
description: "Use on talking-head footage to remove dead air and filler words from the footage index with 30 ms crossfades and room-tone fill, never cutting inside a word and keeping pauses before punchlines. Next skill: jump_cut_pace."
kind: script
tag: talking_head
category: footage
script: node/apply_decisions.mjs
requires: [node>=20]
inputs: "{ spec_path, footage_index_path, max_gap_ms?: 600, filler_words?: [um, uh], keep_breath_ms?: 150 }"
outputs: "new spec version; decision_log"
schema_refs: [video_spec.v1, footage_index.v1]
---
# silence_filler_remove
`apply_decisions` with `cut_pacing.remove_silence` and `cut_pacing.remove_fillers`. Ranges the user marks `keep_pause: true` are skipped. F1 and F2 check the result.
