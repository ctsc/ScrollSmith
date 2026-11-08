---
name: capcut_export
description: "Use when a human editor will finish the video: exports the spec as an EDL-style draft (cut list with sources, timings, captions SRT, asset paths) that can be rebuilt in CapCut or any NLE. No proprietary project format is written. Next skill: export_package."
kind: hybrid
tag: universal
category: render
requires: [node>=20]
inputs: "{ spec_path }"
outputs: "exports/<id>/draft/: cutlist.csv, captions.srt, assets/ (links), README.md"
schema_refs: [video_spec.v1]
---
# capcut_export
CapCut's draft format is undocumented and changes; write the portable cut list and a README with import steps instead. Paths stay local.
