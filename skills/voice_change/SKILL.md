---
name: voice_change
description: "Use for speech-to-speech conversion with ElevenLabs using the user's key, run locally; sets the consent flag (F7) and requires the target voice to be the user's own or a stock voice. Next skill: audio_align."
kind: hybrid
tag: universal
category: audio
requires: [python>=3.10]
inputs: "{ audio_path, target_voice }"
outputs: "audio file; voice_consent recorded"
schema_refs: []
---
# voice_change
Key from the environment only. Refuse target voices that imitate a real person without written consent.
