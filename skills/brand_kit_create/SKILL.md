---
name: brand_kit_create
description: "Use when a branded or talking-head project has no brand_kit.json: collects colors, fonts, logo paths, caption preset, lower-third copy, safe-zone preference and CTA defaults and writes brand_kit.v1. Next skill: edit_style_create or scene_plan_create."
kind: instruction
tag: branded
category: design
inputs: "User's brand assets (local paths), preferences"
outputs: "brand_kit.json (brand_kit.v1)"
schema_refs: [brand_kit.v1]
---
# brand_kit_create

Ask for local paths only; never fetch logos from the web on the user's behalf. Check text colors against backgrounds for 4.5:1 contrast and warn. Default caption preset `mino_clean_3word` for talking heads. Record the font license status as the user states it (`verified` only with a license the user named). Validate against `schemas://brand_kit.v1`.
