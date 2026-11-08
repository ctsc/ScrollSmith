---
name: trend_research
description: "Use to gather current topics for a niche with the assistant's own web search, each stamped with source and fetch time; no scraping against site terms. Next skill: idea_generate."
kind: instruction
tag: universal
category: strategy
inputs: "{ niche, region, window_days }"
outputs: "topics[]: { topic, signal, source_url, fetched_at }"
schema_refs: []
---
# trend_research
Same discipline as `trend_scan`, with `fetched_at` per item.
