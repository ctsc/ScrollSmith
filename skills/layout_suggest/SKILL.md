---
name: layout_suggest
description: "Use to pick a layout and slot map for one range given the pack; same logic as layout_pick for a single range. Next skill: scene_plan_patch."
kind: instruction
tag: universal
category: design
inputs: "{ range, pack_id }"
outputs: "{ layout_id, slot_map }"
schema_refs: []
---
# layout_suggest
See `layout_pick`; return the slot map (`slot_id` to layer_id) for the one range.
