---
name: style_pack_preview
description: "Use to render a pack's sample stills or a 3 s clip locally with Remotion renderStill so the user can see it before choosing. Next skill: style_pack_pick."
kind: hybrid
tag: universal
category: design
requires: [node>=20, chromium (Remotion)]
inputs: "{ pack_id, variant? }"
outputs: "PNG grid or MP4"
schema_refs: []
---
# style_pack_preview
`style_pack_scaffold` the pack into a temp folder, `npx remotion still src/index.ts Sample out.png --props=...` per variant, tile with ffmpeg.
