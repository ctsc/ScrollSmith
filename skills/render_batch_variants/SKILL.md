---
name: render_batch_variants
description: "Use to render A/B variants (hooks, languages, palettes) from one spec: applies each variant's patch ops, shares unchanged range renders, renders locally. Cost multiplies per variant. Next skill: qa_check per variant."
kind: hybrid
tag: universal
category: render
requires: [node>=20, ffmpeg]
inputs: "{ spec_path, variant_ops[]: { name, ops[] } }"
outputs: "specs and renders per variant; receipts"
schema_refs: [video_spec.v1, render_receipt.v1]
---
# render_batch_variants
`scene_plan_patch` per variant, then `render_final`. Report `render_cost_estimate` first and confirm with the user.
