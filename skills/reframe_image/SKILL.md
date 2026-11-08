---
name: reframe_image
description: "Use to crop an image to an aspect with face or saliency detection. Next skill: scene_plan_patch."
kind: hybrid
tag: universal
category: image
requires: [ffmpeg]
inputs: "{ path, aspect }"
outputs: "cropped image"
schema_refs: []
---
# reframe_image
Face crop with MediaPipe when installed; otherwise center-weighted crop with ffmpeg `crop`. Keep the subject inside the target safe zone.
