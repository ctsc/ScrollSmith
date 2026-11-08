---
name: bg_remove
description: "Use when an image needs a cutout (thumbnail subject, product): runs rembg locally and writes a PNG with alpha. Hair edges may need manual cleanup. Next skill: thumbnail_talking_head or reframe_image."
kind: hybrid
tag: universal
category: image
requires: [python>=3.10, rembg]
inputs: "{ image_path, out_path }"
outputs: "PNG with alpha"
schema_refs: []
---
# bg_remove
`pip install rembg[cpu]` then `rembg i in.png out.png` (U2-Net, model downloaded at install). Check edges on a dark and a light background before use.
