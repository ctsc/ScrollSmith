---
name: metadata_write
description: "Use after the render to write per-platform title, caption, hashtags and the required disclosures (AI label, paid partnership, fiction label) into metadata.json. Never promises reach. Next skill: export_package."
kind: instruction
tag: universal
category: workflow
inputs: "script, platforms, claims list, ai_disclosure flags"
outputs: "metadata.json: { per_platform: { title, caption, hashtags[], disclosures[] } }"
schema_refs: []
---
# metadata_write

Title under 60 characters, caption with the hook line first, 3 to 5 specific hashtags (no hashtag stuffing). Add `ai_disclosure` when the spec has realistic generated media or synthetic voice, `fiction` label for chat stories and dramatizations, `paid_partnership` when the user says the video is sponsored. Do not state posting-time or hashtag performance facts.
