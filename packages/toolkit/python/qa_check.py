#!/usr/bin/env python3
"""qa_check: qa_report.v1 for a render. Checks dimensions, fps, duration, loudness, true peak, black and frozen frames, loop seam.
Input: { render_path, spec_path, preset_id?, target_lufs?: -14, true_peak_db?: -1 }  Output: qa_report.v1"""
import json
import os
import re
from toolkit_io import ToolError, ffmpeg, ffprobe_json, run

PRESETS = {"tiktok_1080x1920_30": (1080, 1920, 30), "reels_1080x1920_30": (1080, 1920, 30), "shorts_1080x1920_30": (1080, 1920, 30), "shorts_1080x1920_60": (1080, 1920, 60), "yt_1920x1080": (1920, 1080, 30), "square_1080": (1080, 1080, 30), "preview_540x960": (540, 960, 30)}


def main(inp):
    path, spec_path = inp.get("render_path"), inp.get("spec_path")
    if not path or not spec_path or not os.path.exists(path):
        raise ToolError("INVALID_INPUT", "render_path (existing file) and spec_path are required")
    spec = json.load(open(spec_path, encoding="utf8"))
    meta = ffprobe_json(path)
    v = next((s for s in meta["streams"] if s["codec_type"] == "video"), None)
    a = next((s for s in meta["streams"] if s["codec_type"] == "audio"), None)
    if not v:
        raise ToolError("INVALID_INPUT", "no video stream in render")
    checks = []

    def add(cid, ok, detail, severity="error", fix=None):
        c = {"id": cid, "status": "pass" if ok else severity, "detail": detail}
        if fix and not ok:
            c["fix_hint"] = fix
        checks.append(c)

    preset = inp.get("preset_id") or spec.get("format", {}).get("render_preset") or "tiktok_1080x1920_30"
    w, h, fps_t = PRESETS.get(preset, (spec["format"].get("width", 1080), spec["format"].get("height", 1920), spec["format"].get("fps", 30)))
    num, den = (v.get("r_frame_rate") or "30/1").split("/")
    fps = float(num) / float(den)
    add("Q1_dimensions", (v["width"], v["height"]) == (w, h), f"{v['width']}x{v['height']} vs preset {w}x{h}", fix="Render with the preset's width and height")
    add("Q2_fps", abs(fps - fps_t) < 0.6, f"{fps:.2f} fps vs {fps_t}", fix="Set the composition fps to the preset")
    dur = float(meta["format"]["duration"]) * 1000
    exp = spec["format"]["duration_ms"]
    add("Q3_duration", abs(dur - exp) <= max(400, exp * 0.02), f"{dur:.0f} ms vs spec {exp} ms", fix="Check the last range end and the audio length")
    add("Q4_pixfmt", v.get("pix_fmt") == "yuv420p", f"pix_fmt {v.get('pix_fmt')}", severity="warning", fix="Use -pix_fmt yuv420p for platform compatibility")
    if a:
        log = ffmpeg(["-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"])
        i = re.findall(r"I:\s+(-?[\d.]+) LUFS", log)
        tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", log)
        lufs = float(i[-1]) if i else None
        peak = float(tp[-1]) if tp else None
        target, ceiling = float(inp.get("target_lufs", -14)), float(inp.get("true_peak_db", -1))
        add("Q5_loudness", lufs is not None and abs(lufs - target) <= 1.5, f"{lufs} LUFS vs {target}", severity="warning", fix="Run audio_mix (two-pass loudnorm)")
        add("Q6_true_peak", peak is not None and peak <= ceiling + 0.1, f"{peak} dBTP vs ceiling {ceiling}", fix="Lower the limiter ceiling in audio_mix")
        add("Q7_sample_rate", a.get("sample_rate") in ("48000", 48000), f"sample rate {a.get('sample_rate')}", severity="warning")
    else:
        add("Q5_loudness", False, "no audio stream", fix="Mux the mix with render_final")
    bl = ffmpeg(["-i", path, "-vf", "blackdetect=d=0.5:pix_th=0.10", "-f", "null", "-"])
    blacks = re.findall(r"black_start:([\d.]+)", bl)
    add("Q8_black_frames", not blacks, f"{len(blacks)} black segments over 500 ms" + (f" starting at {blacks[0]} s" if blacks else ""), fix="Check for empty ranges or missing assets")
    fr = ffmpeg(["-i", path, "-vf", "freezedetect=n=0.001:d=1.5", "-f", "null", "-"])
    freezes = re.findall(r"freeze_start: ([\d.]+)", fr)
    expected_static = spec.get("format", {}).get("format_type") in ("talking_head", "podcast_clip")
    add("Q9_frozen_frames", not freezes or expected_static, f"{len(freezes)} frozen segments over 1.5 s", severity="warning", fix="Add motion or shorten the range (rule P1)")
    if (spec.get("loop") or {}).get("mode") not in (None, "none"):
        ffmpeg(["-i", path, "-frames:v", "1", "/tmp/_qa_first.png"])
        ffmpeg(["-sseof", "-0.05", "-i", path, "-frames:v", "1", "/tmp/_qa_last.png"])
        s = ffmpeg(["-i", "/tmp/_qa_first.png", "-i", "/tmp/_qa_last.png", "-filter_complex", "ssim", "-f", "null", "-"])
        m = re.search(r"All:([\d.]+)", s)
        ssim = float(m.group(1)) if m else 0
        add("Q10_loop_seam", ssim >= 0.92, f"first/last frame SSIM {ssim:.3f}", fix="Match the last range end state to frame 0 (loop_seal)")
    errors = [c for c in checks if c["status"] == "error"]
    report = {"schema_version": "qa_report.v1", "render_path": os.path.abspath(path), "spec_path": os.path.abspath(spec_path), "preset_id": preset, "pass": not errors, "checks": checks, "summary": f"{len(errors)} errors, {sum(1 for c in checks if c['status'] == 'warning')} warnings"}
    out = os.path.join(os.path.dirname(os.path.abspath(path)), os.path.splitext(os.path.basename(path))[0] + ".qa.json")
    json.dump(report, open(out, "w", encoding="utf8"), indent=2)
    report["report_path"] = out
    return report


if __name__ == "__main__":
    run(main)
