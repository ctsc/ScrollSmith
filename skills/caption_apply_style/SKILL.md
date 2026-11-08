---
name: caption_apply_style
description: "Use on talking-head and footage edits to turn words.v1 into styled caption pages that avoid the face: picks the preset from the edit style or brand kit, pages with captions_build, shifts pages off face boxes from footage_index (rule F4), hides pages under on-screen text. Next skill: scene_plan_validate."
kind: hybrid
tag: talking_head
category: captions
requires: [node>=20]
inputs: "words.json, footage_index.json, edit_style or brand_kit, spec_path"
outputs: "captions.json (captions.v1) with per-page position overrides; spec captions block updated"
schema_refs: [captions.v1, words.v1, footage_index.v1]
---
# caption_apply_style

1. Run `captions_build` with the preset.
2. For each page, find the face bbox at its midpoint in `footage_index.face_tracks`; if the caption slot overlaps, move the page to the alternate slot inside `universal_relaxed`; if both overlap, use one line; if still overlapping, hide and record a warning.
3. Hide pages during ranges with a `text` or `hud` layer in the same slot.
4. Write `captions.json` and point `spec.captions.words_path` at it. `scene_plan_validate` re-checks F4 and S2.
