---
name: thumbnail_talking_head
description: "Use to make a cover from footage: best frame by open eyes and sharpness (Laplacian variance), bg_remove cutout, text layout inside the safe zone. Faces need consent. Next skill: metadata_write."
kind: hybrid
tag: talking_head
category: render
requires: [python>=3.10, ffmpeg]
inputs: "{ source_id, text }"
outputs: "covers/<id>.png"
schema_refs: []
---
# thumbnail_talking_head
Sample 1 frame per second across the hook range, score sharpness, pick the top 3 for the user. Cutout with `bg_remove`, text with the brand font.
