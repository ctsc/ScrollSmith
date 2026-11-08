#!/usr/bin/env python3
"""edit_style_measure: measurable style stats from a reference video the user has rights to. Local only.
Input: { reference_path }  Output: { duration_ms, cuts_per_min, avg_shot_ms, zoom_events_per_min, music_loudness_lufs_est, suggested_decisions[] }"""
import re
from toolkit_io import ToolError, ffmpeg, ffprobe_json, run


def main(inp):
    path = inp.get("reference_path")
    if not path:
        raise ToolError("INVALID_INPUT", "reference_path is required")
    dur = float(ffprobe_json(path)["format"]["duration"])
    log = ffmpeg(["-i", path, "-vf", "select=gt(scene\\,0.3),showinfo", "-f", "null", "-"])
    cuts = [float(m) for m in re.findall(r"pts_time:([\d.]+)", log)]
    log2 = ffmpeg(["-i", path, "-vf", "crop=iw*0.5:ih*0.5,scale=64:64,select=gt(scene\\,0.08),showinfo", "-f", "null", "-"])
    center = [float(m) for m in re.findall(r"pts_time:([\d.]+)", log2)]
    zooms = [t for t in center if all(abs(t - c) > 0.25 for c in cuts)]
    loud = ffmpeg(["-i", path, "-af", "ebur128", "-f", "null", "-"])
    lufs = re.findall(r"I:\s+(-?[\d.]+) LUFS", loud)
    cpm = len(cuts) / dur * 60 if dur else 0
    zpm = len(zooms) / dur * 60 if dur else 0
    avg_shot = int(dur * 1000 / (len(cuts) + 1))
    suggested = []
    if cpm > 0:
        suggested.append({"id": "cut_pacing.max_shot_length", "params": {"max_ms": max(1500, min(6000, avg_shot))}})
    if zpm > 2:
        suggested.append({"id": "zoom_framing.punch_on_emphasis_word", "params": {"max_per_min": int(round(zpm))}})
    if zpm > 0:
        suggested.append({"id": "zoom_framing.alternate_crop_ab", "params": {}})
    return {"duration_ms": int(dur * 1000), "cuts_per_min": round(cpm, 1), "avg_shot_ms": avg_shot, "zoom_events_per_min": round(zpm, 1), "loudness_lufs_est": float(lufs[-1]) if lufs else None, "suggested_decisions": suggested, "analysis_depth": "full_video", "note": "Zoom detection is a center-crop change heuristic; confirm visually."}


if __name__ == "__main__":
    run(main)
