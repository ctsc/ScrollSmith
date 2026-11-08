---
name: screen_demo_polish
description: "Use on screen recordings for cursor-following zooms, click highlights, idle trims, keystroke captions and blur of sensitive OCR regions, per the screen_demo rulebook. Next skill: edit_plan_create."
kind: hybrid
tag: branded
category: footage
requires: [python>=3.10, ffmpeg]
inputs: "{ source_id }"
outputs: "decisions and blur layers for the spec"
schema_refs: [footage_index.v1, video_spec.v1]
---
# screen_demo_polish
Cursor position via template match on a cursor image or recorded events if available. Zoom 1.5 on clicks (500 ms), idle over 2 s sped 4x, `boxblur` layers over OCR blocks that match email, key or token patterns.
