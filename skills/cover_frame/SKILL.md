---
name: cover_frame
description: "Use after render_final to produce the cover still from the hook range at 1080x1920 and 1280x720 with the on-screen hook text, inside the safe zone. Next skill: metadata_write."
kind: hybrid
tag: universal
category: render
requires: [ffmpeg]
inputs: "render path, spec (hook range), brand kit"
outputs: "covers/<id>.1080x1920.png, covers/<id>.1280x720.png"
schema_refs: []
---
# cover_frame

Pick the sharpest frame in the hook range: `ffmpeg -ss <t> -i render.mp4 -frames:v 1 -q:v 2 cover.png` at 3 candidate times, keep the one with the highest `blurdetect` or variance. For 16:9 crop or letterbox per the brand kit. Overlay the hook text with `drawtext` using a licensed font, inside the safe zone.
