#!/usr/bin/env python3
"""audio_align: words.v1 from narration audio using faster-whisper (or whisperx when installed), then optional range fitting.
Input: { audio_path, script_path?, spec_path?, model?: small, language?: en, out_path? }
Output: { words_path, word_count, duration_ms, mismatches[], spec_path? }"""
import json
import os
from toolkit_io import ToolError, ffprobe_json, run

FILLERS = {"um", "uh", "erm", "hmm", "like", "basically", "literally", "actually"}


def transcribe(path, model, language, prompt):
    try:
        from faster_whisper import WhisperModel  # noqa: WPS433
    except ImportError as e:
        raise ToolError("ENV_MISSING", "faster-whisper is not installed", fix_hint="pip install faster-whisper (or whisperx) in your toolkit venv") from e
    m = WhisperModel(model, device="auto", compute_type="auto")
    segments, _ = m.transcribe(path, language=language, word_timestamps=True, initial_prompt=prompt or None, vad_filter=True)
    words = []
    for seg in segments:
        for w in seg.words or []:
            text = w.word if w.word.startswith(" ") else " " + w.word
            words.append({"text": text, "startMs": int(round(w.start * 1000)), "endMs": int(round(w.end * 1000)), "confidence": round(float(w.probability), 3), "filler": text.strip().lower().strip(".,") in FILLERS})
    return words


def mark_emphasis(words, script):
    emph = set()
    for line in script.get("lines", []):
        for w in line.get("emphasis_words", []):
            emph.add(w.lower().strip(".,!?"))
    for w in words:
        if w["text"].strip().lower().strip(".,!?") in emph:
            w["emphasis"] = True
    return words


def mismatches(words, script):
    spoken = [w["text"].strip().lower().strip(".,!?") for w in words]
    expected = " ".join(l.get("text", "") for l in script.get("lines", [])).lower().split()
    expected = [e.strip(".,!?") for e in expected]
    missing = [e for e in set(expected) if e not in spoken and e.isalpha()]
    return sorted(missing)[:50]


def fit_ranges(spec, words, script):
    """Set each range's end to the end of its last script line's final word."""
    line_end = {}
    cursor = 0
    for line in script.get("lines", []):
        n = len(line.get("text", "").split())
        if n and cursor + n <= len(words):
            line_end[line["id"]] = words[cursor + n - 1]["endMs"]
            cursor += n
    changed = []
    tl = spec["timeline"]
    for i, r in enumerate(tl[:-1]):
        ids = r.get("line_ids") or []
        if ids and ids[-1] in line_end:
            end = line_end[ids[-1]] + 150
            if end != r["end_ms"] and end > r["start_ms"]:
                r["end_ms"] = end
                tl[i + 1]["start_ms"] = end
                changed.append(r["id"])
    return changed


def main(inp):
    path = inp.get("audio_path")
    if not path or not os.path.exists(path):
        raise ToolError("INVALID_INPUT", "audio_path is required and must exist")
    script = json.load(open(inp["script_path"], encoding="utf8")) if inp.get("script_path") else None
    prompt = " ".join(l.get("text", "") for l in script.get("lines", []))[:800] if script else None
    words = transcribe(path, inp.get("model", "small"), inp.get("language", "en"), prompt)
    if script:
        words = mark_emphasis(words, script)
    duration_ms = int(float(ffprobe_json(path)["format"]["duration"]) * 1000)
    out_path = inp.get("out_path") or os.path.join(os.path.dirname(path) or ".", "words.json")
    doc = {"schema_version": "words.v1", "audio_path": path, "duration_ms": duration_ms, "language": inp.get("language", "en"), "words": words}
    json.dump(doc, open(out_path, "w", encoding="utf8"), indent=2)
    result = {"words_path": out_path, "word_count": len(words), "duration_ms": duration_ms, "mismatches": mismatches(words, script) if script else []}
    if inp.get("spec_path") and script:
        spec = json.load(open(inp["spec_path"], encoding="utf8"))
        changed = fit_ranges(spec, words, script)
        base, ext = os.path.splitext(inp["spec_path"])
        import re
        m = re.match(r"^(.*)\.v(\d+)$", base)
        new_path = f"{m.group(1)}.v{int(m.group(2)) + 1}{ext}" if m else f"{base}.v2{ext}"
        json.dump(spec, open(new_path, "w", encoding="utf8"), indent=2)
        result.update({"spec_path": new_path, "ranges_fitted": changed})
    return result


if __name__ == "__main__":
    run(main)
