---
name: wireframe_render
description: "Use after scene_plan_validate passes to show the user a low-fidelity storyboard before any real render: a contact sheet of one frame per range with layout boxes, slot labels, text and timings. Runs locally with the toolkit's Remotion wireframe composition or an HTML fallback. Next skill: render_preview after approval."
kind: hybrid
tag: faceless
category: render
requires: [node>=20]
inputs: "spec_path, out_dir"
outputs: "wireframe.png (contact sheet) plus per-range PNGs"
schema_refs: [video_spec.v1]
---
# wireframe_render

Fastest path: generate an HTML page (one 1080x1920 box per range, slots drawn from `layouts://index`, texts in place, safe-zone overlay) and screenshot it with the user's Chromium (`npx playwright screenshot` or Remotion's `@remotion/renderer` still API). Show the sheet and ask for approval before `render_preview`. This is a checkpoint: do not continue without an answer.
