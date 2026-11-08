---
name: tone_profile_create
description: "Use when the user wants scripts to sound like them: derives a tone profile (sentence length, vocabulary, humor, taboo words, signature phrases) from 3 or more samples of their own writing or transcripts. Writes tone_profile.json. Next skill: script_write."
kind: instruction
tag: universal
category: script
inputs: "3 or more samples the user wrote or spoke"
outputs: "tone_profile.json: { avg_sentence_words, vocabulary_level, humor, pov, taboo[], signature_phrases[], examples[] }"
schema_refs: []
---
# tone_profile_create

Only from the user's own material; do not model another creator's voice. Quote at most 5 short signature phrases. Describe the tone in rules a writer can follow, then rewrite one sample line three ways to confirm with the user.
