---
name: carousel_generate
description: "Use to turn a spec or outline into image carousel slides (4:5 or 1:1) with the carousel_slide layout, rendered locally as PNGs. Watch text density. Next skill: export_package."
kind: hybrid
tag: universal
category: render
requires: [node>=20]
inputs: "{ spec_path or outline[], aspect: 4:5|1:1, pack_id }"
outputs: "carousel/<n>.png"
schema_refs: []
---
# carousel_generate
One idea per slide, under 25 words, slide 1 is the hook, last slide the CTA. Render with Remotion `renderStill` per slide (or the wireframe HTML and a screenshot). Keep text inside the aspect's safe zone.
