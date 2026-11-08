---
name: series_plan
description: "Use when a channel needs a repeatable series: format, episode template, variation axes, cadence and the first 10 episode seeds. Writes series/<series_id>.json. Do not use for one-off videos. Next skill: content_calendar or idea_generate."
kind: instruction
tag: faceless
category: strategy
inputs: "Angle from niche_research, goals, style pack id"
outputs: "series/<series_id>.json: { series_id, promise, format_type, style_pack_id, beat_template[], variation_axes{}, cadence, episode_seeds[] }"
schema_refs: [style_pack.v1]
---
# series_plan

Define the beat template (for example hook, context, escalation x3, payoff, cta) and the variation axes from the style pack manifest (palette, camera, motion, layout) so `variation_pick` can rotate them. State the loop rule (does the series loop, and how). Write the file and summarize it in 5 lines. Repetitive series get downranked, so every series needs at least 3 variation axes with 3 or more values each.
