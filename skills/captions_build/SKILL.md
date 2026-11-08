---
name: captions_build
description: "Use when word timings (words.json) exist and burn-in or sidecar captions are needed. Do not use without word timings (run audio_align or transcribe first). Returns captions.json pages plus SRT and VTT. Next skill: scene_plan_validate (S2) or render_preview."
kind: script
tag: universal
category: captions
requires: [node>=20]
script: "toolkit/node/captions_build.mjs"
inputs: "{ words_path, preset, max_words_per_page?, emphasis?, emphasis_words?, combine_tokens_within_ms?, slot_width_px?, out_dir? }"
outputs: "{ captions_path, srt_path, vtt_path, pages, overflow_pages[] }"
schema_refs: [words.v1, captions.v1]
---

# captions_build

Pages word timings into TikTok-style caption pages with `@remotion/captions` `createTikTokStyleCaptions`, then splits pages to `max_words_per_page`, re-splits pages wider than the caption slot, marks emphasis tokens and writes SRT and VTT sidecars.

## Run
`node toolkit/node/captions_build.mjs '{"words_path": "captions/ep001.words.json", "preset": "cube_pop_3word", "emphasis": "numbers", "slot_width_px": 800}'`

## Presets
See `caption-presets` in the toolkit data (also `get_schema`/`get_asset_sources` are unrelated; use `get_skill_file captions_build data/caption-presets.json` or the `platforms://presets` resource). Presets define font, weight, size at 1080 width, color, stroke or shadow, words per page, animation and vertical position. `mino_clean_3word` needs a verified TikTok Sans license; otherwise it falls back to Inter 600.

## Emphasis
- `numbers`: digits and number words.
- `keywords`: words in `emphasis_words` (take them from `script.lines[].emphasis_words`).
- `keywords_and_numbers`: both.

## Rules
- `slot_width_px` is the caption slot width in pixels at the spec width (layout slot w times width). Pages still flagged `overflow` must get fewer words or a smaller preset.
- Captions are hidden while on-screen text occupies the same area (set `caption_state: hidden_for_text` on that range).
- For talking-head footage use `caption_apply_style`, which adds face avoidance.
