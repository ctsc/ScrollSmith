---
name: recipe_repurpose_variants
title: Platform variants of a finished spec
description: Re-render one approved spec for several platforms with per-platform safe-zone validation, captions and metadata.
args:
  spec_path: Approved spec path
  platforms: Comma-separated platforms (default tiktok,reels,shorts)
---
1. `scene_plan_validate` {{spec_path}} with each platform preset in {{platforms}}; `scene_plan_patch` any S1 or S2 issue per platform.
2. `multi_platform_resize` -> `qa_check` per variant -> `metadata_write` per platform -> `export_package` -> `publish_checklist`.
