#!/usr/bin/env python3
"""beat_detect: beats.v1 from a music file. librosa when available, ffmpeg onset fallback otherwise.
Input: { audio_path, offset_ms?: 0 }  Output: { schema_version, bpm, beats_ms[], downbeats_ms[], method, confidence }"""
import re
from toolkit_io import ToolError, ffmpeg, ffprobe_json, run


def with_librosa(path, offset_ms):
    import librosa  # noqa: WPS433
    import numpy as np

    y, sr = librosa.load(path, sr=22050, mono=True)
    tempo, frames = librosa.beat.beat_track(y=y, sr=sr, units="frames")
    beats = librosa.frames_to_time(frames, sr=sr) * 1000 + offset_ms
    onset = librosa.onset.onset_strength(y=y, sr=sr)
    strengths = onset[np.clip(frames, 0, len(onset) - 1)]
    # 4/4 assumption: the phase whose beats are strongest on average is beat 1.
    best = max(range(4), key=lambda p: float(strengths[p::4].mean()) if len(strengths[p::4]) else 0)
    downbeats = beats[best::4]
    bpm = float(tempo if not hasattr(tempo, "__len__") else tempo[0])
    return bpm, [int(round(b)) for b in beats], [int(round(d)) for d in downbeats], "librosa", 0.8


def with_ffmpeg(path, offset_ms):
    dur = float(ffprobe_json(path)["format"]["duration"]) * 1000
    log = ffmpeg(["-i", path, "-af", "silencedetect=n=-20dB:d=0.05", "-f", "null", "-"])
    onsets = [float(m) * 1000 for m in re.findall(r"silence_end: ([\d.]+)", log)]
    if len(onsets) < 4:
        raise ToolError("RUNTIME", "too few onsets for a tempo estimate", fix_hint="pip install librosa soundfile for the real detector")
    gaps = sorted(b - a for a, b in zip(onsets, onsets[1:]) if 250 <= b - a <= 1000)
    if not gaps:
        raise ToolError("RUNTIME", "no regular onset spacing found", fix_hint="pip install librosa soundfile")
    period = gaps[len(gaps) // 2]
    bpm = 60000 / period
    beats = []
    t = onsets[0] + offset_ms
    while t < dur + offset_ms:
        beats.append(int(round(t)))
        t += period
    return bpm, beats, beats[::4], "ffmpeg_fallback", 0.4


def main(inp):
    path = inp.get("audio_path")
    if not path:
        raise ToolError("INVALID_INPUT", "audio_path is required")
    offset = int(inp.get("offset_ms", 0))
    try:
        bpm, beats, downbeats, method, conf = with_librosa(path, offset)
    except ImportError:
        bpm, beats, downbeats, method, conf = with_ffmpeg(path, offset)
    return {"schema_version": "beats.v1", "audio_path": path, "bpm": round(bpm, 2), "beats_ms": beats, "downbeats_ms": downbeats, "method": method, "confidence": conf}


if __name__ == "__main__":
    run(main)
