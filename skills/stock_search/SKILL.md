---
name: stock_search
description: "Use when a range needs real-world footage or photos and the user has no asset for it: gives the user exact search queries for free sources from get_asset_sources (Pexels, Pixabay, Mixkit, Wikimedia Commons and others) with license notes; the user downloads and registers. No downloading by the server or the assistant. Next skill: asset_register."
kind: instruction
tag: universal
category: assets
inputs: "range visual intent, platform, orientation"
outputs: "queries[]: { range_id, source, query, license_summary, attribution_required }"
schema_refs: []
---
# stock_search

Call `get_asset_sources video` or `image`. Write 2 queries per range (literal and metaphorical). Repeat the license summary and `last_verified` date for each source and tell the user to confirm on the asset page. After download: `asset_register` with the source and license id, then `scene_plan_patch` to reference the asset id.
