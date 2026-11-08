---
name: recipe_faceless_short
title: "Faceless short (code-driven)"
description: "End-to-end chain for a faceless 9:16 video from idea to export package, with checkpoints at script, wireframe and preview."
args:
  topic: What the video is about (one sentence)
  style_pack_id: Style pack id (default cubestory)
  target_s: Target length in seconds (default 30)
---
Follow these skills in order. `checkpoint` means show the artifact and wait for approval before continuing. Use `run_state` so a rerun skips completed steps.

1. `local_env_check` (first run only), then `project_create` if no project folder exists.
2. `idea_generate` -> `script_write` -> `hook_generate` (pick 1, keep 2 for A/B) -> `hook_grade` -> `script_tighten` -> checkpoint: script.
3. `variation_pick` -> `scene_plan_create`.
4. `tts_generate` -> `audio_align` -> `music_select` -> `beat_detect` -> `beat_sync_apply` -> `sfx_place` -> `captions_build` -> `loop_seal` (if the format loops).
5. `scene_plan_validate` -> `wireframe_render` -> checkpoint: wireframe.
6. `render_preview` -> `qa_check` -> checkpoint: preview.
7. `originality_check` -> `policy_check` -> `render_final` -> `qa_check`.
8. `cover_frame` -> `metadata_write` -> `export_package` -> `publish_checklist`.

Inputs for this run: topic "{{topic}}", style pack "{{style_pack_id}}", target length {{target_s}} s.
