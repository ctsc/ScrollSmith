---
name: recipe_product_demo
title: Screen or product demo
description: Software or product walkthrough from a screen recording with cursor zooms, idle trims and privacy blurs.
args:
  footage_path: Path to the screen recording
  target_s: Target length in seconds (default 45)
---
1. `footage_ingest` {{footage_path}} with `ocr: true` -> `get_rulebook screen_demo`.
2. `edit_plan_create` with the screen_demo decisions (cursor zoom, click highlight, idle trim); flag OCR blocks that look like secrets for blur; checkpoint: plan.
3. `caption_apply_style` -> `audio_mix` (voice_enhance if the mic is rough) -> `scene_plan_validate` -> `render_preview` -> `qa_check` -> checkpoint.
4. `render_final` (target {{target_s}} s) -> `qa_check` -> `cover_frame` -> `metadata_write` -> `export_package`.
