---
name: brand_voice_profile
description: "Use when scripts should sound like the user or brand: computes stats from their own samples (average sentence length, reading level, word frequency) and writes tone_profile.json with adjectives, banned words, hook habits and signature phrases. Replaces tone_profile_create for brands. Next skill: script_write."
kind: hybrid
tag: branded
category: script
requires: [node>=20]
inputs: "{ samples[] (transcripts, captions, posts) }"
outputs: "tone_profile.json"
schema_refs: []
---
# brand_voice_profile
Compute the numbers with a short local script (sentence length distribution, Flesch-Kincaid estimate, top 50 content words). Add the qualitative fields from reading the samples. Only the user's own or licensed material.
