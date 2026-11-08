---
name: recipe_cubestory_episode
title: Cubestory episode (series)
description: One episode of a looping 3D voxel series with the cubestory style pack, rotating variation axes and checking originality against past episodes.
args:
  episode_seed: One-line idea for the episode
  series_id: Series id (default cubestory)
---
1. `run_state start`. Load `series/{{series_id}}.json` and `history/episodes.json`.
2. `variation_pick` (avoid the last 3 episodes) -> `script_write` from "{{episode_seed}}" with the series beat template -> `hook_generate` -> `hook_grade` -> `script_tighten` -> checkpoint: script.
3. `scene_plan_create` with `get_style_pack cubestory` -> `tts_generate` -> `audio_align` -> `music_select` (loop-friendly, bar-aligned) -> `beat_detect` -> `beat_sync_apply` -> `sfx_place` -> `captions_build` (`cube_pop_3word`) -> `loop_seal`.
4. `scene_plan_validate` -> `wireframe_render` -> checkpoint.
5. `render_preview` -> `qa_check` (loop seam check) -> `originality_check` -> `policy_check` -> checkpoint.
6. `render_final` -> `qa_check` -> `cover_frame` -> `metadata_write` -> `export_package` -> `originality_check` action record.
