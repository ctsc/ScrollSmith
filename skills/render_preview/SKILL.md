---
name: render_preview
description: "Use after the wireframe is approved: renders a fast low-resolution preview (540x960, CRF 28) of the spec with the style pack's Remotion project on the user's machine, or an ffmpeg slideshow fallback for packs without components. Writes render_receipt.v1. Next skill: qa_check."
kind: hybrid
tag: faceless
category: render
requires: [node>=20, chromium (Remotion), ffmpeg]
inputs: "spec_path, pack project dir, out_path"
outputs: "renders/<id>.preview.mp4, render_receipt.json"
schema_refs: [video_spec.v1, render_receipt.v1]
---
# render_preview

Remotion: `npx remotion render src/index.ts Main --props=<spec_path> --scale=0.5 --crf=28 --codec=h264 <out>` inside the pack project (see `get_style_pack cubestory` for the entry). Remotion's license requires a company license for companies with more than 3 people; individuals and small teams are free (check remotion.dev/license, unverified here). Fallback without a pack: render one PNG per range from the wireframe HTML and stitch with ffmpeg `concat` plus the narration. Write `render_receipt.json` with `local_only: true`, inputs hash, duration and the command used.
