---
name: competitor_breakdown
description: "Use when the user shares a creator or video they admire and wants its structure explained. Works text-only from descriptions, transcripts or a screen recording the user provides; never scrapes or logs into platforms. Returns the beat structure, hook type, pacing estimate and reusable patterns, never copies. Next skill: edit_style_create or series_plan."
kind: instruction
tag: universal
category: strategy
inputs: "Description, transcript, or local recording; a public link only for text-only context"
outputs: "{ analysis_depth: full_video|text_only, beats[], hook_type, visual_change_estimate, patterns_to_adapt[], do_not_copy[] }"
schema_refs: []
---
# competitor_breakdown

Report `analysis_depth` honestly: `full_video` only when you watched a local file via `footage_ingest` or `video_review`; otherwise `text_only`. Extract patterns (structure, pacing, caption style), not content. List what must not be copied (script wording, exact visuals, music). If the user only has a link, follow `link_resolve` and its fallback chain; never bypass logins, private accounts or age gates.
