#!/usr/bin/env python3
"""audio_mix: final mix (voice chain, ducked music, SFX bus, two-pass loudnorm) or voice-only enhance mode. Pure ffmpeg.
Input: { mode?: mix|enhance, narration_path, music_path?, sfx?: [{path, at_ms, gain_db}], music_gain_db?: -18, duck_db?: -12,
         target_lufs?: -14, true_peak_db?: -1, strength?: 0.4, out_path }
Output: { out_path, measured: { lufs, true_peak_db, lra }, measured_before? }"""
import json
import os
import re
from toolkit_io import ToolError, ffmpeg, run


def measure(path):
    log = ffmpeg(["-i", path, "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"])
    m = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", log, re.S)
    if not m:
        raise ToolError("RUNTIME", "could not parse loudnorm output")
    d = json.loads(m.group(0))
    return {"lufs": float(d["input_i"]), "true_peak_db": float(d["input_tp"]), "lra": float(d["input_lra"]), "_raw": d}


def voice_chain(strength):
    nr = max(3, min(30, int(30 * strength)))
    return f"highpass=f=80,afftdn=nr={nr}:nf=-30,deesser=i=0.3,equalizer=f=300:t=q:w=1.2:g=-2,equalizer=f=3000:t=q:w=1:g=2,acompressor=threshold=-18dB:ratio=2.5:attack=10:release=120:makeup=2"


def loudnorm_two_pass(src, out, target, tp):
    m = measure(src)["_raw"]
    ffmpeg(["-i", src, "-af", f"loudnorm=I={target}:TP={tp}:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true", "-ar", "48000", out])


def main(inp):
    nar = inp.get("narration_path")
    out = inp.get("out_path")
    if not nar or not out:
        raise ToolError("INVALID_INPUT", "narration_path and out_path are required")
    target, tp = float(inp.get("target_lufs", -14)), float(inp.get("true_peak_db", -1))
    tmp = out + ".pre.wav"
    if inp.get("mode") == "enhance":
        before = measure(nar)
        ffmpeg(["-i", nar, "-af", voice_chain(float(inp.get("strength", 0.4))), tmp])
        loudnorm_two_pass(tmp, out, target, tp)
        os.remove(tmp)
        after = measure(out)
        return {"out_path": out, "measured_before": {k: v for k, v in before.items() if k != "_raw"}, "measured_after": {k: v for k, v in after.items() if k != "_raw"}}
    inputs, filters, mix = ["-i", nar], [f"[0:a]{voice_chain(float(inp.get('strength', 0.4)))}[v]"], ["[v]"]
    idx = 1
    if inp.get("music_path"):
        inputs += ["-stream_loop", "-1", "-i", inp["music_path"]]
        filters.append(f"[{idx}:a]volume={float(inp.get('music_gain_db', -18))}dB[m0]")
        filters.append(f"[m0][v]sidechaincompress=threshold=0.02:ratio=6:attack=20:release=250:makeup=1[m]")
        mix.append("[m]")
        idx += 1
    for s in inp.get("sfx", []) or []:
        inputs += ["-i", s["path"]]
        filters.append(f"[{idx}:a]volume={float(s.get('gain_db', -9))}dB,adelay={int(s['at_ms'])}|{int(s['at_ms'])}[s{idx}]")
        mix.append(f"[s{idx}]")
        idx += 1
    filters.append("".join(mix) + f"amix=inputs={len(mix)}:duration=first:normalize=0[out]")
    ffmpeg([*inputs, "-filter_complex", ";".join(filters), "-map", "[out]", "-ar", "48000", tmp])
    loudnorm_two_pass(tmp, out, target, tp)
    os.remove(tmp)
    after = measure(out)
    return {"out_path": out, "measured": {k: v for k, v in after.items() if k != "_raw"}}


if __name__ == "__main__":
    run(main)
