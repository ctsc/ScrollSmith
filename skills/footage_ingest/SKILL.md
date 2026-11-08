---
name: footage_ingest
description: "Use first on any user footage (talking head, podcast, screen recording): local ffprobe metadata, scene cuts, silence and filler detection, WhisperX transcript with word timings and speakers, face boxes per second, OCR of on-screen text. Writes footage_index.v1 with local_only true. Never uploads. Next skill: edit_style_get or edit_plan_create."
kind: script
tag: talking_head
category: footage
script: python/footage_ingest.py
requires: [python>=3.10, ffmpeg, ffprobe, whisperx or faster-whisper, mediapipe (optional), tesseract (optional)]
inputs: "{ footage_path, out_dir, language?: en, face_fps?: 1, ocr?: false, diarize?: false }"
outputs: "footage_index.json (footage_index.v1), words.json, transcript.txt"
schema_refs: [footage_index.v1, words.v1]
---
# footage_ingest

Runs locally: `python toolkit/python/footage_ingest.py input.json`. Steps: ffprobe metadata; `select=gt(scene,0.3)` scene cuts; `silencedetect=n=-35dB:d=0.4`; transcription with word timestamps; filler words from a list (um, uh, like, you know, so, basically) marked in words; face bbox per second with MediaPipe when installed; OCR with Tesseract when `ocr` is true; sentence and topic boundaries from the transcript. Makes no network calls; model downloads happen only at install time. Read the index, not the video: it is the only thing the assistant needs to plan the edit.
