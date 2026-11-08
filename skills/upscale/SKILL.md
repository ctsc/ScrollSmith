---
name: upscale
description: "Use to upscale an image locally with Real-ESRGAN. Next skill: scene_plan_patch."
kind: hybrid
tag: universal
category: image
requires: [python>=3.10, realesrgan]
inputs: "{ path, factor: 2|4 }"
outputs: "upscaled image"
schema_refs: []
---
# upscale
`realesrgan-ncnn-vulkan -i in.png -o out.png -s 4` (portable binary) or the Python package. Model download at install only.
