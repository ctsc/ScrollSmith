---
name: edit_style_get
description: "Use when a saved edit style should be applied: loads edit_style.v1 from the project, lists the decisions it enables with parameters and conflicts, and merges in the format_specific defaults for gaps. Next skill: edit_plan_create."
kind: instruction
tag: talking_head
category: footage
inputs: "edit_style_id or path, format_type"
outputs: "Resolved decision list with params, conflicts resolved, source per decision (style or default)"
schema_refs: [edit_style.v1]
---
# edit_style_get

Read the style file, then `get_registry format_specific` for the matching defaults bundle. Style decisions override defaults; resolve `conflicts_with` by keeping the style's choice. Present the list grouped by category so the user can toggle items before `edit_plan_create`.
