---
name: asset_register
description: "Use when the user adds a file (music, sfx, image, video, font, logo) to the project: hashes it, dedupes by sha256, records source and license fields in assets/ledger.json and library.json. Unknown license defaults to commercial_ok false, which blocks render_final (rule A1). Next skill: asset_library_search."
kind: script
tag: universal
category: assets
script: node/asset_register.mjs
requires: [node>=20]
inputs: "{ project_path, files: [{ path, kind, source, license_id?, attribution?, commercial_ok?, content_id_risk?, tags?, mood?, bpm? }] }"
outputs: "{ registered[], duplicates[], ledger_path }"
schema_refs: [asset_library.v1]
---
# asset_register

Runs locally: `node toolkit/node/asset_register.mjs input.json`. Ask the user for the license per file when it is not obvious from the source; never guess `commercial_ok: true`. Attribution strings are stored verbatim and copied into `attribution.txt` by `export_package`.
