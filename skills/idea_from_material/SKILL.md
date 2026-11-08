---
name: idea_from_material
description: "Use to turn transcripts, call notes, FAQs or product docs into video ideas that cite their source offsets. Material is processed locally only and may be confidential. Next skill: script_write."
kind: instruction
tag: branded
category: strategy
inputs: "{ material_paths[], count }"
outputs: "ideas[]: { idea_id, quote_refs[]: { path, offset }, hook_angle, format_type }"
schema_refs: []
---
# idea_from_material
Read the files locally, chunk by heading or 500 words, pick statements with a surprising or specific claim. Never paste client material into any external service.
