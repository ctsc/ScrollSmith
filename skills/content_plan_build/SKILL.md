---
name: content_plan_build
description: "Use to plan N videos with format, hook angle, CTA and source material per slot, deduped against history. Next skill: idea_generate or script_write per slot."
kind: instruction
tag: universal
category: strategy
inputs: "{ goals, pillars, count, cadence }"
outputs: "content_plan.json [{ slot, title, format_type, hook_type, cta, source_material_ref }]"
schema_refs: []
---
# content_plan_build
Rotate hook types and formats, follow the pillar ratios, tie each slot to a real source (transcript, FAQ, past comment) when the user has one. Check `history/episodes.json` for repeats.
