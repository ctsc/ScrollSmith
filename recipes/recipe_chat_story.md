---
name: recipe_chat_story
title: Chat story (fiction)
description: Text-message style story with the chat_ui layout, labelled as fiction, no real people.
args:
  premise: Story premise in one or two lines
  target_s: Target length in seconds (default 45)
---
1. `script_write` as dialogue lines with `speaker` fields (fictional names only) from "{{premise}}", target {{target_s}} s; one cliffhanger before the payoff. `fact_check` is skipped; `policy_check` must add the fiction label.
2. `hook_generate` (`in_media_res`, `stakes`) -> `hook_grade` -> `script_tighten` -> checkpoint: script.
3. `scene_plan_create` with layout `chat_ui`, one message per range, `pop_in` primitives, typing indicator before replies -> `tts_generate` (two stock voices or none, captions carry the text) -> `sfx_place` (pop on each message) -> `music_select` (tense, under 100 BPM) -> `captions_build` off when the chat text is the caption.
4. `scene_plan_validate` -> `wireframe_render` -> checkpoint -> `render_preview` -> `qa_check` -> `policy_check` -> `render_final` -> `qa_check` -> `metadata_write` (fiction disclosure) -> `export_package`.
