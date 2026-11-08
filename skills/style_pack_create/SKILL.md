---
name: style_pack_create
description: "Use when the user wants their own visual style as a reusable pack: writes a style_pack.v1 manifest (tokens, components, variation axes, caption preset, motion defaults) and scaffolds a Remotion project folder locally. Do not use to pick an existing pack (style_pack_pick). Next skill: wireframe_render."
kind: hybrid
tag: faceless
category: design
inputs: "Brand kit or mood description, reference images the user owns, format_type"
outputs: "packs/<pack_id>/manifest.json (style_pack.v1) plus src/ scaffold"
schema_refs: [style_pack.v1]
---
# style_pack_create

Draft the manifest from `schemas://style_pack.v1`: palette tokens with contrast at least 4.5:1 for text, type scale (body at least 48 px at 1080 width), 3 or more variation axes with 3 or more values each, component list with props, caption preset, motion defaults from `platforms://presets` motion primitives. Fetch `get_style_pack cubestory` as the reference layout for the folder. Fonts: only ones the user has license to embed; Google Fonts (OFL) are the safe default, mark anything else `license: unverified`. Validate the manifest locally with the toolkit (`node toolkit/node/lib/validate.mjs` via a short script) before rendering a wireframe.
