---
name: recipe_listicle
title: Listicle or ranking
description: Top-N or tier-list video with one range per item, countdown structure and the best item last.
args:
  topic: The list topic
  count: Number of items (default 5)
  target_s: Target length in seconds (default 40)
---
1. `idea_generate` is skipped; `script_write` with beats hook, item N..1 (escalation), payoff (item 1), cta; {{count}} items for "{{topic}}", target {{target_s}} s. Each item line under 12 words.
2. `hook_generate` with the `list_promise` and `shock_number` types -> `hook_grade` -> `script_tighten` -> checkpoint: script.
3. `scene_plan_create` with layouts `list_ranking` or `tier_list` and a `counter` layer per item -> `tts_generate` -> `audio_align` -> `music_select` -> `beat_detect` -> `beat_sync_apply` -> `sfx_place` (click on counters) -> `captions_build`.
4. `scene_plan_validate` -> `wireframe_render` -> checkpoint -> `render_preview` -> `qa_check` -> checkpoint -> `policy_check` -> `render_final` -> `qa_check` -> `cover_frame` -> `metadata_write` -> `export_package`.
