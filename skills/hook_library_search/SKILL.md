---
name: hook_library_search
description: "Use to find hook patterns for a topic from the served taxonomy plus hooks the user saved locally; returns the pattern and a paraphrase, never scraped platform text. Next skill: hook_generate."
kind: script
tag: universal
category: script
script: node/asset_library_search.mjs
requires: [node>=20]
inputs: "{ topic, format?, limit? }"
outputs: "hooks[]: { pattern_type, example_paraphrase, why_it_works }"
schema_refs: []
---
# hook_library_search
Read `hooks://taxonomy` and the project's `hooks/saved.json` if present. Do not scrape platforms; paraphrase any example.
