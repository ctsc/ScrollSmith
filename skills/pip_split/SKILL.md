---
name: pip_split
description: "Use for picture-in-picture and split layouts (pip_corner, split_vertical, split_horizontal) from layouts://index with their slots. Next skill: scene_plan_patch."
kind: instruction
tag: universal
category: design
inputs: "{ range_id, mode: pip|split, sources[] }"
outputs: "layout and layer mapping"
schema_refs: []
---
# pip_split
Pick the layout id from `layouts://index`, map each source to a slot, keep captions in the shared caption slot.
