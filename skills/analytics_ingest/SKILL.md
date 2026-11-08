---
name: analytics_ingest
description: "Use when the user shares post metrics (CSV export, screenshot, pasted text): extracts them into metrics the other skills can read, without OAuth or estimates. Next skill: analytics_review."
kind: instruction
tag: universal
category: quality
inputs: "{ platform, pasted_or_exported_data }"
outputs: "metrics.json: { platform, posts[], unavailable[] }"
schema_refs: []
---
# analytics_ingest
Missing metrics stay in `unavailable`; say which ones. Retention curves from screenshots are approximate: record them as `approx: true`.
