---
name: account_stats_ingest
description: "Use when the user pastes or exports their follower and post metrics: normalizes them into stats.json with 7 and 30 day changes. Public page text via link_resolve is allowed; no OAuth, no scraping. Metrics that are not provided stay unavailable. Next skill: review_compare_posts."
kind: instruction
tag: branded
category: quality
inputs: "{ platform, handle, data? (pasted text, CSV, screenshot) }"
outputs: "stats.json: { platform, handle, fetched_at, followers?, posts[]: { id?, posted_at, views?, likes?, comments?, shares?, avg_view_s?, retention? } }"
schema_refs: []
---
# account_stats_ingest
Read whatever the user gives you and write `null` for anything missing; never estimate. Record `fetched_at` and the source of each number (pasted, export, public page).
