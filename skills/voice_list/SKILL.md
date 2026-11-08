---
name: voice_list
description: "Use to see the voice catalog with calibrated words per second for duration_estimate, plus local calibration data the user adds. Next skill: tts_generate."
kind: resource
tag: universal
category: audio
inputs: "none"
outputs: "voices table from platforms://presets"
schema_refs: []
---
# voice_list
Read `platforms://presets` voices; after the first TTS run, `duration_estimate` can store the measured wps per voice in `project.json`.
