---
name: voice_enhance
description: "Use on a recorded voice track that sounds roomy, noisy or thin before audio_mix. Applies a conservative ffmpeg chain (denoise, high-pass, presence EQ, gentle compression) and reports before and after loudness. Does not change the voice identity. Next skill: audio_mix."
kind: script
tag: talking_head
category: audio
script: python/audio_mix.py
requires: [ffmpeg]
inputs: "{ mode: enhance, narration_path, strength?: 0.4, out_path }"
outputs: "{ out_path, measured_before, measured_after }"
schema_refs: []
---
# voice_enhance

Runs locally through `audio_mix.py` in `enhance` mode. Keep strength under 0.6 unless the user asks; heavy denoise produces the underwater artifact. Always A/B a 10 s excerpt for the user before processing the whole track.
