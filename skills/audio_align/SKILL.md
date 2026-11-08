---
name: audio_align
description: "Use after narration exists (TTS or recording) to get word timings: runs WhisperX or faster-whisper locally and writes words.v1, then fits range boundaries to spoken line ends. Do not use on footage with multiple speakers (footage_ingest does diarization). Next skill: music_select or captions_build."
kind: script
tag: universal
category: audio
script: python/audio_align.py
requires: [python>=3.10, ffmpeg, whisperx or faster-whisper]
inputs: "{ audio_path, script_path?, spec_path?, model?: small|medium|large-v3, language?: en }"
outputs: "words.json (words.v1), optional new spec version with range end_ms fitted to lines"
schema_refs: [words.v1, video_spec.v1]
---
# audio_align

Runs locally: `python toolkit/python/audio_align.py input.json`. Install once with `pip install -r toolkit/python/requirements.txt` in a venv (`local_env_check` reports what is missing). When `script_path` is given the script text is used as a prompt so numbers and names align; mismatched words are reported, not silently corrected. Output words include `startMs`, `endMs`, `text` with a leading space (the `@remotion/captions` convention) and `emphasis` flags copied from the script. Expected accuracy: word boundaries within about 40 ms on clean narration.
