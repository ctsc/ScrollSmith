---
name: beat_detect
description: "Use after music_select to get the beat and downbeat grid of the chosen track: librosa locally, ffmpeg onset fallback when librosa is missing. Writes beats.v1. Next skill: beat_sync_apply."
kind: script
tag: universal
category: audio
script: python/beat_detect.py
requires: [python>=3.10, ffmpeg, librosa (optional)]
inputs: "{ audio_path, offset_ms?: 0 }"
outputs: "beats.json (beats.v1): { bpm, beats_ms[], downbeats_ms[], method }"
schema_refs: [beats.v1]
---
# beat_detect

Runs locally: `python toolkit/python/beat_detect.py input.json`. With librosa: `beat_track` plus a 4/4 downbeat estimate from onset strength. Without it: ffmpeg `silencedetect`-based onset grid at the estimated tempo, marked `method: ffmpeg_fallback` with lower confidence. Expected precision on a click track: within one frame at 30 fps.
