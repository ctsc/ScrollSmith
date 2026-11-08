---
name: video_review
description: "Use when the user wants feedback on a finished video: full review from a local file via footage_ingest (hook timing, pacing, caption density, audio levels, safe zone, loop) or text-only review from a description or transcript. Always states analysis_depth. Next skill: scene_plan_patch or hook_rewrite."
kind: hybrid
tag: universal
category: quality
requires: [python>=3.10, ffmpeg]
inputs: "local_path or transcript or description"
outputs: "{ analysis_depth, scores{}, top_fixes[] (max 5), notes[] }"
schema_refs: [footage_index.v1]
---
# video_review

With a file: `footage_ingest` then `qa_check`, read the index (cut rate, silences, filler count, caption presence via OCR, loudness) and grade against the format's rulebook. Without a file: review the script structure only and say so. Give at most 5 fixes in priority order, each tied to a skill that implements it.
