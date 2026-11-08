---
name: render_final
description: "Use only after qa_check passes on the preview and the user approved: renders the master at the platform preset (1080x1920, CRF 18, H.264 yuv420p, AAC 48 kHz), muxes the audio_mix output, burns or attaches captions, and writes render_receipt.v1. Refuses when any asset in the spec lacks a verified license (rule A1). Next skill: qa_check, then cover_frame."
kind: hybrid
tag: universal
category: render
requires: [node>=20, chromium (Remotion), ffmpeg]
inputs: "spec_path, mix.wav, captions.json or .srt, preset_id"
outputs: "renders/<id>.<preset>.mp4, render_receipt.json"
schema_refs: [video_spec.v1, render_receipt.v1, render_preset in platforms://presets]
---
# render_final

Before rendering run `scene_plan_validate` with the ledger: any A1 error stops here, no exceptions. Remotion full scale with the preset's fps and CRF, then `ffmpeg -i video.mp4 -i mix.wav -c:v copy -c:a aac -b:a 192k -ar 48000 -shortest out.mp4`; burn captions with `subtitles=captions.srt:force_style=...` only when the caption mode is burn-in. Record preset, command, sha256 of inputs and outputs in the receipt. Talking-head edits without a pack: cut and reframe with ffmpeg `trim`, `crop`, `zoompan` filters from the spec's footage layers.
