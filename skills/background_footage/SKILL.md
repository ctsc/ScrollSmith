---
name: background_footage
description: "Use for split-screen faceless videos that need gameplay or satisfying footage underneath: picks from the user's own local library only, by category and duration. Third-party footage carries high reuse-policy risk and is refused. Next skill: scene_plan_patch."
kind: script
tag: faceless
category: assets
script: node/asset_library_search.mjs
requires: [node>=20]
inputs: "{ project_path, category, duration_ms }"
outputs: "asset id for the background layer"
schema_refs: [asset_library.v1]
---
# background_footage
`asset_library_search` with `kind: video`, `query: <category>`, `min_ms: duration_ms`, `require_commercial: true`. If nothing matches, tell the user to record their own gameplay or use CC0 video sources from `get_asset_sources video`; reused third-party footage is downranked and may be removed.
