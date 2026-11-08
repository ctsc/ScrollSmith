---
name: recipe_repurpose_long
title: Repurpose a long video into clips
description: Find 3 to 5 self-contained moments in a long local recording and turn each into a vertical clip.
args:
  footage_path: Path to the long video on the user's machine
  clips: Number of clips (default 3)
---
1. `footage_ingest` on {{footage_path}} (diarize when available). Read sentences and topic changes.
2. Pick {{clips}} candidate segments (30 to 90 s, self-contained, strongest claim first); show the user a table with start, end and the hook line; checkpoint.
3. For each approved segment: `edit_plan_create` (podcast_clip or talking_head rulebook) -> `caption_apply_style` -> `audio_mix` -> `render_preview` -> `qa_check` -> checkpoint -> `render_final` -> `qa_check` -> `cover_frame` -> `metadata_write`.
4. `export_package` per clip, `publish_checklist`.
