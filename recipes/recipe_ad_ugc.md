---
name: recipe_ad_ugc
title: Ad or UGC video
description: Product video with the ad_ugc rulebook, fact-checked claims and required disclosures.
args:
  product: Product or offer in one line
  footage_paths: Paths to demo or UGC takes (optional)
  target_s: Target length in seconds (default 25)
---
1. `goals_intake` (if missing) -> `get_rulebook ad_ugc`.
2. `script_write` with beats hook, problem, demo, proof, offer, cta for "{{product}}", {{target_s}} s -> `fact_check` (every claim) -> `hook_generate` -> `hook_grade` -> `cta_write` -> `script_tighten` -> checkpoint: script and claims.
3. If {{footage_paths}}: `footage_ingest` -> `edit_plan_create`; else `scene_plan_create` with product images from the user (`asset_register`).
4. `caption_apply_style` or `captions_build` -> `music_select` -> `sfx_place` -> `audio_mix` -> `scene_plan_validate` (meta_ads safe zone) -> `render_preview` -> `qa_check` -> checkpoint.
5. `policy_check` (paid partnership disclosure) -> `render_final` -> `qa_check` -> `multi_platform_resize` -> `metadata_write` -> `export_package`.
