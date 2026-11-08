---
name: meme_template
description: "Use to render a meme-style card from a template the user owns with their text; copyrighted meme images are refused. Next skill: scene_plan_patch."
kind: hybrid
tag: universal
category: image
requires: [node>=20]
inputs: "{ template_id (owned), texts[] }"
outputs: "PNG"
schema_refs: []
---
# meme_template
Owned templates only (`asset_register` with `source: own`). Render with the wireframe HTML approach and a screenshot, or Remotion `renderStill`.
