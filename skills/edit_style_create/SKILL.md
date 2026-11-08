---
name: edit_style_create
description: "Use when the user wants edits that look like a reference they have rights to (their own past video or a local file): measures cut rate, average shot length, zoom frequency and amount, caption preset, music level, color stats from the file and maps them to registry decisions with parameters. Writes edit_style.v1. Text-only when only a link or description exists. Next skill: edit_plan_create."
kind: hybrid
tag: talking_head
category: footage
requires: [python>=3.10, ffmpeg]
inputs: "{ reference_path | description, name, out_path }"
outputs: "edit_style.json (edit_style.v1) with analysis_depth full_video or text_only"
schema_refs: [edit_style.v1, edit_decision.v1]
---
# edit_style_create

Measure with `python toolkit/python/edit_style_measure.py` (scene cuts per minute, zoom events via frame-difference of center crop, caption OCR sample, loudness of music segments). Translate measurements to decisions: for example 24 cuts per minute becomes `cut_pacing.max_shot_length` 2.5 s; punch-ins every 8 s becomes `zoom_framing.punch_on_emphasis_word` with `max_per_min` 8. Set `analysis_depth: "text_only"` and lower confidence when working from a description. Never store the reference footage outside the user's machine and never copy its script, graphics or music.
