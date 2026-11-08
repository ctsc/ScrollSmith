---
name: reference_analyze
description: "Use to deconstruct a reference video the user has rights to into a draft spec: footage_ingest, scene detection, contact sheet, assistant vision on sampled frames, hook type, pacing stats. Only analyze structure, never copy content. Next skill: edit_style_create or scene_plan_create."
kind: hybrid
tag: universal
category: footage
requires: [python>=3.10, ffmpeg]
inputs: "{ video_path or url (via link_resolve) }"
outputs: "{ analysis_depth, transcript, shot_list[], hook_type, pacing_stats, draft_spec }"
schema_refs: [video_spec.v1]
---
# reference_analyze
Contact sheet: `ffmpeg -i in.mp4 -vf "select=gt(scene\,0.3),scale=270:-2,tile=6x6" -frames:v 1 sheet.png`. Describe each shot in the user's own words for the draft spec; the draft has no copied text, graphics or music.
