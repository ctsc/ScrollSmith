---
name: storyboard_export
description: "Use to produce a human-readable storyboard (storyboard.md and PDF) from a spec: range table with timings, text, visuals and the wireframe stills. Next skill: checkpoint_request."
kind: hybrid
tag: universal
category: workflow
requires: [node>=20]
inputs: "{ spec_path }"
outputs: "storyboard.md, storyboard.pdf"
schema_refs: [video_spec.v1]
---
# storyboard_export
Markdown first; PDF via the user's Chromium (`npx playwright pdf` or the browser print dialog).
