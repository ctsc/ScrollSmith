---
name: sfx_generate
description: "Use when the library lacks a sound: ElevenLabs text_to_sound_effects with the user's own key, run locally, registered with ai_generated true. Next skill: sfx_place."
kind: hybrid
tag: universal
category: audio
requires: [python>=3.10]
inputs: "{ prompt, duration_ms, out_path }"
outputs: "wav registered in the ledger"
schema_refs: [asset_library.v1]
---
# sfx_generate
Key from `ELEVENLABS_API_KEY` in the user's environment; never print it. Register with `source: generated`, `ai_generated: true`, license per the provider's terms (unverified until the user confirms).
