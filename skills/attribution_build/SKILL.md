---
name: attribution_build
description: "Use before posting to build the description credits from the asset ledger: one line per asset that requires attribution, in the source's requested format. Next skill: metadata_write."
kind: script
tag: universal
category: assets
script: node/asset_library_search.mjs
requires: [node>=20]
inputs: "{ spec_path, project_path }"
outputs: "attribution.txt"
schema_refs: [asset_library.v1]
---
# attribution_build
Read `spec.assets` and the ledger (`asset_library_search` with the asset ids); emit `attribution` strings verbatim. Assets with `attribution_required: true` and no string are an error: ask the user for the exact credit text.
