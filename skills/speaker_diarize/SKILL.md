---
name: speaker_diarize
description: "Use on multi-speaker footage to label words with speaker ids using local pyannote (optional install, needs a Hugging Face token the user holds). Overlapping speech is marked. Next skill: podcast_clip_format."
kind: hybrid
tag: talking_head
category: footage
requires: [python>=3.10, pyannote.audio (optional)]
inputs: "{ source_id }"
outputs: "words.json with speaker fields"
schema_refs: [words.v1]
---
# speaker_diarize
If pyannote is not installed, say so and offer manual labelling by sentence. The HF token stays in the user's environment.
