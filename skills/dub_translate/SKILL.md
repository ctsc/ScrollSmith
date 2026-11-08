---
name: dub_translate
description: "Use to make a translated, re-voiced variant: translate the script, tts_generate in the target language, audio_align, re-time ranges for text expansion, re-validate. Next skill: render_batch_variants."
kind: hybrid
tag: universal
category: audio
requires: [python>=3.10, ffmpeg]
inputs: "{ spec_path, script_path, target_lang }"
outputs: "specs/<id>.<lang>.v1.json, audio/<lang>/narration.wav"
schema_refs: [video_spec.v1, script.v1]
---
# dub_translate
Expect 15 to 30 percent longer text in many languages; shorten the translation before stretching ranges. Captions are rebuilt from the new words file.
