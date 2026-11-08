---
name: style_pack_scaffold
description: "Use to write a served pack (or a new pack skeleton) into the user's Remotion project: manifest, components, sample props. Fonts must be OFL or owned. Next skill: wireframe_render or render_preview."
kind: script
tag: universal
category: design
script: node/project_create.mjs
requires: [node>=20]
inputs: "{ pack_id or { name, references, engine }, target_dir }"
outputs: "files plus manifest.json"
schema_refs: [style_pack.v1]
---
# style_pack_scaffold
Fetch each file with `get_skill_file` or `get_style_pack <id>` and write them under `packs/<id>/`. Run `npm install` in the pack folder only when the user agrees (network).
