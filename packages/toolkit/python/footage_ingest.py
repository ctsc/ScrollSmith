#!/usr/bin/env python3
"""footage_ingest: footage_index.v1 from a local video. No network calls.
Input: { footage_path, out_dir, language?: en, face_fps?: 1, ocr?: false, diarize?: false, model?: small }
Output: { index_path, words_path, transcript_path, duration_ms, scene_cuts, silences, words, faces_sampled, ocr_blocks }"""
import hashlib
import json
import os
import re
import subprocess
from toolkit_io import ToolError, ffmpeg, ffprobe_json, need_bin, run

FILLERS = {"um", "uh", "erm", "hmm", "like", "basically", "literally", "actually", "so"}


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def scene_cuts(path):
    log = ffmpeg(["-i", path, "-vf", "select=gt(scene\\,0.3),showinfo", "-f", "null", "-"])
    return [int(float(m) * 1000) for m in re.findall(r"pts_time:([\d.]+)", log)]


def silences(path):
    log = ffmpeg(["-i", path, "-af", "silencedetect=n=-35dB:d=0.4", "-f", "null", "-"])
    starts = [float(m) for m in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(m) for m in re.findall(r"silence_end: ([\d.]+)", log)]
    return [{"start_ms": int(s * 1000), "end_ms": int(e * 1000)} for s, e in zip(starts, ends)]


def transcribe(path, language, model, diarize):
    try:
        from faster_whisper import WhisperModel  # noqa: WPS433
    except ImportError as e:
        raise ToolError("ENV_MISSING", "faster-whisper is not installed", fix_hint="pip install faster-whisper in your toolkit venv") from e
    m = WhisperModel(model, device="auto", compute_type="auto")
    segs, _ = m.transcribe(path, language=language, word_timestamps=True, vad_filter=True)
    words, sentences = [], []
    for seg in segs:
        sentences.append({"start_ms": int(seg.start * 1000), "end_ms": int(seg.end * 1000), "text": seg.text.strip()})
        for w in seg.words or []:
            t = w.word if w.word.startswith(" ") else " " + w.word
            words.append({"text": t, "startMs": int(round(w.start * 1000)), "endMs": int(round(w.end * 1000)), "confidence": round(float(w.probability), 3), "filler": t.strip().lower().strip(".,") in FILLERS, "speaker": None})
    if diarize:
        sentences = [dict(s, note="diarization requires pyannote and a HF token; not run") for s in sentences]
    return words, sentences


def faces(path, duration_ms, fps, out_dir):
    try:
        import cv2  # noqa: WPS433
        import mediapipe as mp  # noqa: WPS433
    except ImportError:
        return [], "mediapipe not installed; face tracks skipped (pip install mediapipe opencv-python)"
    frames_dir = os.path.join(out_dir, "frames")
    os.makedirs(frames_dir, exist_ok=True)
    ffmpeg(["-i", path, "-vf", f"fps={fps},scale=540:-2", os.path.join(frames_dir, "f_%05d.png")])
    det = mp.solutions.face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5)
    samples = []
    for i, name in enumerate(sorted(os.listdir(frames_dir))):
        img = cv2.imread(os.path.join(frames_dir, name))
        res = det.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        if res.detections:
            b = res.detections[0].location_data.relative_bounding_box
            samples.append({"t_ms": int(i * 1000 / fps), "bbox": {"x": round(b.xmin, 4), "y": round(b.ymin, 4), "w": round(b.width, 4), "h": round(b.height, 4)}, "confidence": round(float(res.detections[0].score[0]), 3)})
        os.remove(os.path.join(frames_dir, name))
    return [{"track_id": "face_0", "samples": samples}] if samples else [], None


def ocr(path, out_dir, step_s=2):
    if not need_bin_optional("tesseract"):
        return [], "tesseract not installed; OCR skipped"
    frames_dir = os.path.join(out_dir, "ocr_frames")
    os.makedirs(frames_dir, exist_ok=True)
    ffmpeg(["-i", path, "-vf", f"fps=1/{step_s}", os.path.join(frames_dir, "o_%05d.png")])
    blocks = []
    for i, name in enumerate(sorted(os.listdir(frames_dir))):
        p = subprocess.run(["tesseract", os.path.join(frames_dir, name), "-", "--psm", "6"], capture_output=True, text=True)
        text = " ".join(p.stdout.split())
        if len(text) > 3:
            blocks.append({"t_ms": i * step_s * 1000, "text": text[:300]})
        os.remove(os.path.join(frames_dir, name))
    return blocks, None


def need_bin_optional(name):
    import shutil
    return shutil.which(name) is not None


def main(inp):
    path, out_dir = inp.get("footage_path"), inp.get("out_dir")
    if not path or not out_dir or not os.path.exists(path):
        raise ToolError("INVALID_INPUT", "footage_path (existing file) and out_dir are required")
    os.makedirs(out_dir, exist_ok=True)
    meta = ffprobe_json(path)
    v = next((s for s in meta["streams"] if s["codec_type"] == "video"), None)
    if not v:
        raise ToolError("INVALID_INPUT", "no video stream")
    duration_ms = int(float(meta["format"]["duration"]) * 1000)
    num, den = (v.get("r_frame_rate") or "30/1").split("/")
    fps = round(float(num) / float(den), 3)
    words, sentences = transcribe(path, inp.get("language", "en"), inp.get("model", "small"), bool(inp.get("diarize")))
    notes = []
    tracks, note = faces(path, duration_ms, float(inp.get("face_fps", 1)), out_dir)
    if note:
        notes.append(note)
    blocks = []
    if inp.get("ocr"):
        blocks, note = ocr(path, out_dir)
        if note:
            notes.append(note)
    topic = [s["start_ms"] for a, s in zip(sentences, sentences[1:]) if s["start_ms"] - a["end_ms"] > 1200]
    source_id = "src_" + sha256(path)[:12]
    index = {
        "schema_version": "footage_index.v1", "local_only": True, "source_id": source_id, "path": os.path.abspath(path), "sha256": sha256(path),
        "duration_ms": duration_ms, "fps": fps, "width": v.get("width"), "height": v.get("height"), "audio_channels": next((s.get("channels") for s in meta["streams"] if s["codec_type"] == "audio"), 0),
        "scene_cuts_ms": scene_cuts(path), "silences": silences(path), "sentences": sentences, "topic_changes_ms": topic,
        "fillers": [{"start_ms": w["startMs"], "end_ms": w["endMs"], "text": w["text"].strip()} for w in words if w["filler"]],
        "face_tracks": tracks, "ocr_blocks": blocks, "notes": notes,
    }
    index_path, words_path, tx_path = (os.path.join(out_dir, n) for n in ("footage_index.json", "words.json", "transcript.txt"))
    json.dump(index, open(index_path, "w", encoding="utf8"), indent=2)
    json.dump({"schema_version": "words.v1", "audio_path": os.path.abspath(path), "duration_ms": duration_ms, "language": inp.get("language", "en"), "words": words}, open(words_path, "w", encoding="utf8"), indent=2)
    open(tx_path, "w", encoding="utf8").write("\n".join(s["text"] for s in sentences))
    return {"index_path": index_path, "words_path": words_path, "transcript_path": tx_path, "duration_ms": duration_ms, "scene_cuts": len(index["scene_cuts_ms"]), "silences": len(index["silences"]), "words": len(words), "faces_sampled": sum(len(t["samples"]) for t in tracks), "ocr_blocks": len(blocks), "notes": notes}


if __name__ == "__main__":
    run(main)
