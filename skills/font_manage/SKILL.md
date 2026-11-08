---
name: font_manage
description: "Use to register fonts with their license in the local font registry; OFL (Google Fonts) preferred, anything else marked by the user. Next skill: style_pack_create or brand_kit_create."
kind: script
tag: universal
category: design
script: node/asset_register.mjs
requires: [node>=20]
inputs: "{ project_path, files: [{ path, kind: font, source, license_id }] }"
outputs: "ledger entries with kind font"
schema_refs: [asset_library.v1]
---
# font_manage
Use `asset_register` with `kind: font`. Desktop licenses often forbid embedding in video; mark `commercial_ok` only when the user confirms.
