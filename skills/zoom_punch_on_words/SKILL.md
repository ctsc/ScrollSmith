---
name: zoom_punch_on_words
description: "Use on faceless specs to add zoom_punch animations on emphasis words from word timings. Next skill: scene_plan_validate."
kind: script
tag: universal
category: motion
script: node/scene_plan_patch.mjs
requires: [node>=20]
inputs: "{ spec_path, words_path, scale?: 1.12 }"
outputs: "new spec version"
schema_refs: [video_spec.v1, words.v1]
---
# zoom_punch_on_words
One `zoom_punch` per emphasis word (300 ms, ease-out), at most 2 per range; patch via `scene_plan_patch`.
