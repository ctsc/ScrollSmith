---
name: qa_check
description: "Use on every render (preview and final): ffprobe checks for resolution, fps, duration, audio loudness and clipping, black or frozen frames, and a caption safe-zone sample via OCR when available. Writes qa_report.v1 with pass or fail and fix hints. Next skill: render_final after a passing preview, or export_package after a passing final."
kind: script
tag: universal
category: quality
script: python/qa_check.py
requires: [ffmpeg, ffprobe]
inputs: "{ render_path, spec_path, preset_id?, expect_captions?: true }"
outputs: "qa_report.json (qa_report.v1)"
schema_refs: [qa_report.v1, video_spec.v1]
---
# qa_check

Runs locally: `python toolkit/python/qa_check.py input.json`. Checks: dimensions and fps match the preset; duration within 2 percent of the spec; `ebur128` integrated loudness within 1.5 LU of the target and true peak under the ceiling; `blackdetect` and `freezedetect` find nothing longer than 500 ms; first and last frame SSIM when the spec loops; optional OCR of 3 frames to confirm caption text is inside `universal_relaxed`. Any fail blocks the next step.
