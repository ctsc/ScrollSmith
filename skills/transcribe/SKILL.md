---
name: transcribe
description: "Use to transcribe any audio or video to words.v1 with faster-whisper or WhisperX locally (or a provider STT with the user's key). Same engine as audio_align without the script fitting. Next skill: captions_build or repurpose_long_to_shorts."
kind: script
tag: universal
category: audio
script: python/audio_align.py
requires: [python>=3.10, ffmpeg, faster-whisper]
inputs: "{ audio_path, model?, language? }"
outputs: "words.json"
schema_refs: [words.v1]
---
# transcribe
`python toolkit/python/audio_align.py` without `script_path`.
