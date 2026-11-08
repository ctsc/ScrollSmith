---
name: render_cost_estimate
description: "Use before a render to estimate frames, time and TTS characters locally from earlier receipts (ms per frame per pack); notes the Remotion company-license rule. Calibrates from receipts. Next skill: checkpoint_request."
kind: script
tag: universal
category: render
script: node/duration_estimate.mjs
requires: [node>=20]
inputs: "{ spec_path, preset }"
outputs: "{ frames, est_seconds, tts_chars, gpu_needed, license_note }"
schema_refs: [video_spec.v1, render_receipt.v1]
---
# render_cost_estimate
frames = duration_ms / 1000 * fps; est_seconds = frames * median ms per frame from `renders/*.receipt.json` for the pack (default 80 ms when none). License note: Remotion requires a company license above 3 employees (verify at remotion.dev).
