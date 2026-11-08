---
name: duration_estimate
description: "Use when a script or a single line must be timed before TTS exists (scene_plan_create, script_tighten). Do not use when real word timings exist (use words.json). Returns est_ms per line from a per-voice words-per-second table. Next skill: scene_plan_create."
kind: script
tag: universal
category: script
requires: [node>=20]
script: "toolkit/node/duration_estimate.mjs"
inputs: "{ text | script_path, voice_id?, speed?, project_path? }"
outputs: "{ est_ms, wps_used, spoken_words, per_line? }"
schema_refs: [script.v1]
---

# duration_estimate

Counts spoken words (numbers, money and percents are expanded to their spoken form: "32" is "thirty two") and divides by the voice's words per second. Adds 60 ms per comma, 120 ms per full stop and 250 ms per SSML break.

## Run
- One line: `node toolkit/node/duration_estimate.mjs '{"text": "Day 5: 32 coins.", "voice_id": "local_default"}'`
- Whole script: `node toolkit/node/duration_estimate.mjs '{"script_path": "scripts/ep001.json", "project_path": "."}'`

## Calibration
The default is 2.5 words per second (a placeholder). After every `tts_generate`, the toolkit updates `voices.calibration.json` in the project with the measured rate (exponential moving average). Always pass `project_path` so the calibrated value is used.

## Rules
- Acronyms are spoken letter by letter; write them with dots or spaces in the script if timing matters ("A.I.").
- Keep digits in `display_text` for on-screen use; the spoken form is only for timing and TTS.
