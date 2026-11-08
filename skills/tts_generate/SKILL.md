---
name: tts_generate
description: "Use when a script needs narration audio and the user has no recording. Runs a TTS provider on the user's machine with the user's own API key (ElevenLabs, OpenAI, Azure, or local Piper and Kokoro) through the swappable adapter; the hosted MCP never sees keys or audio. Writes narration.wav plus per-line files. Do not use for cloning any voice without written consent. Next skill: audio_align."
kind: hybrid
tag: faceless
category: audio
requires: [python>=3.10, ffmpeg]
inputs: "script.v1, voice_id from data/voices.json or the user's provider, provider env var"
outputs: "audio/narration.wav, audio/lines/<line_id>.wav, tts_receipt.json { provider, voice_id, chars, voice_consent }"
schema_refs: [script.v1]
---
# tts_generate

Read `platforms://presets` voices for provider notes. Provider keys come from the user's environment (`ELEVENLABS_API_KEY`, `OPENAI_API_KEY`, `AZURE_SPEECH_KEY`); never print them, never send them anywhere but the provider. Local engines (Piper, Kokoro) need no key and no network after install. Generate one file per line so `audio_align` can map lines to ranges, then concatenate with 150 ms gaps using ffmpeg `concat`. Set `voice_consent: true` only for the user's own voice or a stock provider voice. Record provider, voice id and character count in `tts_receipt.json` so the user can track their own spend.
