---
name: overlay_insert
description: "Use to place image overlays when entities are mentioned, using word timings as triggers and a pop_in primitive inside the safe zone. Next skill: scene_plan_validate."
kind: script
tag: talking_head
category: footage
script: node/scene_plan_patch.mjs
requires: [node>=20]
inputs: "{ spec_path, words_path, entity_map: { word: asset_id } }"
outputs: "new spec version with overlay layers"
schema_refs: [video_spec.v1, words.v1]
---
# overlay_insert
Overlay starts 100 ms before the word, lasts 1.5 to 2.5 s, top slot of the layout, never over the face (F4 logic applies to overlays too).
