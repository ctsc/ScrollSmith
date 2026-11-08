---
name: audio_mix
description: "Use before render_final to produce the final mix: voice chain (denoise, de-ess, EQ, compression), music ducking under speech, SFX bus, two-pass loudnorm to the platform target. Pure ffmpeg, runs locally. Returns mix.wav and the measured loudness. Next skill: render_final."
kind: script
tag: universal
category: audio
script: python/audio_mix.py
requires: [ffmpeg]
inputs: "{ narration_path, music_path?, sfx[]: {path, at_ms, gain_db}, music_gain_db?: -18, duck_db?: -12, target_lufs?: -14, out_path }"
outputs: "{ out_path, measured: { lufs, true_peak_db, lra } }"
schema_refs: []
---
# audio_mix

Runs locally: `python toolkit/python/audio_mix.py input.json`. Filter chain: `highpass=f=80, arnndn (if model present) or afftdn, deesser, acompressor` on voice; `sidechaincompress` for ducking; `adelay` per SFX; `loudnorm` first pass to measure then second pass with the measured values. Targets of -14 LUFS and -1 dBTP are conventions, not verified platform requirements; say so if the user asks.
