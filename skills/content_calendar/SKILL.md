---
name: content_calendar
description: "Use when the user wants a posting schedule for one or more series over 2 to 8 weeks. Produces a calendar with episode seeds, formats and platforms, no publishing or scheduling integration. Next skill: idea_generate per slot."
kind: instruction
tag: universal
category: strategy
inputs: "Series files, cadence, start date, platforms"
outputs: "calendar[]: { date, series_id, episode_seed, format_type, platforms[], status: planned }"
schema_refs: []
---
# content_calendar

Spread series evenly, alternate hook types day to day, and leave one slot a week for a reactive or trend-based episode. Output a Markdown table plus the JSON. Do not state best posting times as facts; if the user asks, say they are channel-specific and point them at their own analytics.
