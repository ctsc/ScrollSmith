---
name: style_pack_pick
description: "Use when a new project or series has no style pack. Compares the available packs (get_style_pack) against the audience, mood and format and recommends one with the variation axes to rotate. Returns pack_id and reasons. Next skill: series_plan or scene_plan_create."
kind: instruction
tag: faceless
category: design
inputs: "goals, series promise, format_type"
outputs: "{ pack_id, reasons[], variation_plan{} }"
schema_refs: [style_pack.v1]
---
# style_pack_pick

List the packs with `get_style_pack`. Packs with `status: scaffold` have a manifest but few components; say so and estimate the extra work. Recommend one pack and name a fallback. If none fit, propose a new pack manifest the user can build with `style_pack_create`.
