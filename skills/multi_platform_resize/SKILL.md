---
name: multi_platform_resize
description: "Use after a final render when the user posts to several platforms: re-validates the spec against each platform safe zone, renders or re-encodes a variant per preset (fps, bitrate, length caps), and names files by platform. Next skill: export_package."
kind: hybrid
tag: universal
category: render
requires: [ffmpeg]
inputs: "spec_path, master render, platforms[]"
outputs: "renders/<id>.<platform>.mp4 per platform, warnings per platform"
schema_refs: [video_spec.v1]
---
# multi_platform_resize

Same aspect across TikTok, Reels and Shorts, so re-encode only when fps or bitrate differ; re-run `scene_plan_validate` with each platform's safe-zone preset and report S1 and S2 warnings per platform. For 16:9 or 1:1 targets, re-render from the spec with the matching render preset rather than cropping the vertical master.
