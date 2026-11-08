---
name: recipe_review_and_improve
title: Review and improve an existing video
description: Honest review of a finished video (full from a local file, text-only otherwise) followed by concrete patches.
args:
  input: Local file path, or a transcript or description
---
1. `link_resolve` if {{input}} is a URL (report analysis_depth). `video_review` on the file or text.
2. Present at most 5 fixes with the skill that implements each; checkpoint: which to apply.
3. Apply: `hook_rewrite`, `scene_plan_patch`, `caption_apply_style`, `audio_mix` as chosen -> `scene_plan_validate` -> `render_preview` -> `qa_check` -> `retention_score` before and after.
