---
name: color_look_apply
description: "Use to apply a LUT or a contrast and saturation look to footage with skin protection, via ffmpeg lut3d and eq. Watch skin-tone drift. Next skill: render_preview."
kind: hybrid
tag: talking_head
category: footage
requires: [ffmpeg]
inputs: "{ source_id, lut_path? or look: { contrast, saturation, warmth } }"
outputs: "color decision on the spec; ffmpeg filter string"
schema_refs: [video_spec.v1]
---
# color_look_apply
`lut3d=file.cube` at 60 to 80 percent strength blended with the original, or `eq=contrast=1.08:saturation=1.1`. Compare a face crop before and after; back off if skin shifts orange or green. Store as a `color_look.*` decision so it is logged.
