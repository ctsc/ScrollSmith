---
name: layout_pick
description: "Use when choosing a layout for a range or a whole spec from layouts://index: matches content kind (title plus visual, list, versus, chat, chart, map, quote, pip, talking head, screen demo) to a layout and its slots. Returns layout ids per range with the reason. Next skill: scene_plan_create or scene_plan_patch."
kind: instruction
tag: universal
category: design
inputs: "ranges with content description, platform, format_type"
outputs: "picks[]: { range_id, layout_id, slots_used[], reason }"
schema_refs: []
---
# layout_pick

Read `layouts://index`. Prefer the layout whose slots match the number of text and visual elements; never place text outside a slot. Alternate layouts across consecutive ranges to create visual change, but keep the same layout for sibling items in a list. Every slot you use must sit inside the safe-zone preset named by the layout.
