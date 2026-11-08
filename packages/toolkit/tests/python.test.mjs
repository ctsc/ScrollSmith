import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const py = join(here, "..", "python");
const have = (bin) => spawnSync(bin, ["-version"]).status !== null || spawnSync(bin, ["--version"]).status !== null;
const python = ["python3", "python"].find((p) => spawnSync(p, ["--version"]).status === 0);

test("python scripts return error.v1 with exit 1 on invalid input", { skip: !python }, () => {
  const r = spawnSync(python, [join(py, "beat_detect.py")], { input: "{}", encoding: "utf8" });
  assert.equal(r.status, 1);
  const e = JSON.parse(r.stdout);
  assert.equal(e.code, "INVALID_INPUT");
  assert.equal(e.retryable, false);
});

test("beat_detect finds a 120 BPM click track within one frame", { skip: !python || !have("ffmpeg") }, () => {
  const dir = mkdtempSync(join(tmpdir(), "beats-"));
  const wav = join(dir, "click.wav");
  execFileSync(python, ["-c", `
import wave, struct, math
sr=22050; dur=10.0; bpm=120; period=60/bpm
frames=bytearray()
for i in range(int(sr*dur)):
    t=i/sr; ph=(t % period)
    v=int(12000*math.sin(2*math.pi*1000*t)*math.exp(-ph*60)) if ph<0.03 else 0
    frames+=struct.pack('<h',v)
w=wave.open(${JSON.stringify(wav)},'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(bytes(frames)); w.close()`]);
  const inPath = join(dir, "in.json");
  writeFileSync(inPath, JSON.stringify({ audio_path: wav }));
  const r = spawnSync(python, [join(py, "beat_detect.py"), inPath], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const out = JSON.parse(r.stdout);
  assert.equal(out.schema_version, "beats.v1");
  assert.ok(Math.abs(out.bpm - 120) < 3, `bpm ${out.bpm}`);
  const beats = out.beats_ms;
  assert.ok(beats.length >= 15, `beats ${beats.length}`);
  for (let i = 1; i < beats.length; i++) assert.ok(Math.abs(beats[i] - beats[i - 1] - 500) <= 34, `spacing ${beats[i] - beats[i - 1]} at ${i}`);
});
