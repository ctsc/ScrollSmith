---
name: recipe_talking_head_edit
title: "Talking-head edit (local footage)"
description: "Edit one or more talking-head takes on the user's machine: ingest, style, decisions, captions, brand, render. Footage never leaves the computer."
args:
  footage_paths: Comma-separated paths to the takes
  edit_style_id: Saved edit style id (optional; otherwise create one from a reference)
  target_s: Target length in seconds (default 45)
---
1. `local_env_check`, `goals_intake` (if the project has no goals).
2. `footage_ingest` on {{footage_paths}} -> `edit_style_get` {{edit_style_id}} (or `edit_style_create` from a reference the user has rights to) -> `edit_rulebook_get` talking_head.
3. `edit_plan_create` -> checkpoint: edit plan and decision_log.
4. `caption_apply_style` -> `sfx_music_auto_place` (`music_select`, `sfx_place`, `audio_mix`) -> brand overlays (`lower_third_apply`, `logo_bug_apply`).
5. `scene_plan_validate` (rules incl. F1 to F7) -> `render_preview` -> `qa_check` -> checkpoint: preview.
6. `render_final` -> `cover_frame` or `thumbnail_talking_head` -> `metadata_write` -> `export_package`.

Target length {{target_s}} s. Report `analysis_depth` honestly if any input came from a link.
