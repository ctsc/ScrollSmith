---
name: voice_clone
description: "Use to clone the user's own consented voice with ElevenLabs using their key; requires a consent attestation recorded in the receipt. Next skill: tts_generate."
kind: hybrid
tag: universal
category: audio
requires: [python>=3.10]
inputs: "{ samples[], consent_attestation: string }"
outputs: "voice_id; tts_receipt consent fields"
schema_refs: []
---
# voice_clone
No attestation, no clone. Store the attestation text and date in `voices/<voice_id>.json`. Never clone another person's voice.
