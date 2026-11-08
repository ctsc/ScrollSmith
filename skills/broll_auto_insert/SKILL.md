---
name: broll_auto_insert
description: "Use on talking-head edits to add b-roll on noun phrases and claims at a target density: extracts candidates from words, searches the user's library or stock_search, registers assets and patches the spec. Never covers the face during emotional moments. Next skill: scene_plan_validate."
kind: hybrid
tag: talking_head
category: footage
requires: [node>=20]
inputs: "{ spec_path, words_path, density_per_min?: 4, sources: [own_library, stock, screenshots] }"
outputs: "new spec version with broll layers; list of ranges still needing assets"
schema_refs: [video_spec.v1]
---
# broll_auto_insert
Candidates: concrete nouns, numbers, named products. Rank by claim strength, keep at most `density_per_min`. Place 1.5 to 3 s overlays starting 100 ms before the word, with `broll_overlay.cover_cut` decisions. Skip ranges the user marked emotional.
