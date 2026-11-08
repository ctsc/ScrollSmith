---
name: knowledge_search
description: "Use to search the user's own coaching, lesson or call transcripts for quotable excerpts with source and timestamp: local BM25 over supplied files, optional local embeddings. Only the user's own or licensed corpus. Next skill: idea_from_material."
kind: hybrid
tag: branded
category: strategy
requires: [node>=20]
inputs: "{ query, corpus_path }"
outputs: "excerpts[]: { text, source_title, start_ms? }"
schema_refs: []
---
# knowledge_search
Build a simple BM25 index over paragraphs (a 40-line node script is enough); return excerpts under 60 words with the file and offset.
