import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { startRun, beginStep, finishStep, loadRun } from "../node/run_state.mjs";
import { registerAsset } from "../node/asset_register.mjs";
import { searchLibrary, placement } from "../node/asset_library_search.mjs";
import { selectMusic } from "../node/music_select.mjs";
import { validateAgainst } from "../node/lib/validate.mjs";

const lib = {
  items: [
    { id: "m1", path: "music/upbeat.mp3", kind: "music", duration_ms: 90000, bpm: 128, onsets_ms: [120], loudness_lufs: -12, tags: ["upbeat", "synth"], mood: ["energetic"], license: { source: "YouTube Audio Library", license_id: "yt-audio-library", commercial_ok: true, content_id_risk: "none" } },
    { id: "m2", path: "music/sad.mp3", kind: "music", duration_ms: 60000, bpm: 80, tags: ["piano"], mood: ["sad"], license: { source: "unknown", license_id: "unknown", commercial_ok: null, content_id_risk: "unknown" } },
    { id: "m3", path: "music/trap.mp3", kind: "music", duration_ms: 120000, bpm: 140, tags: ["trap"], mood: ["energetic"], license: { source: "Pixabay", license_id: "pixabay", commercial_ok: true, content_id_risk: "high" } },
    { id: "s1", path: "sfx/whoosh.wav", kind: "sfx", duration_ms: 600, loudness_lufs: -20, tags: ["whoosh", "transition"], license: { license_id: "CC0", commercial_ok: true } },
  ],
};

test("run_state skips completed steps with identical inputs", () => {
  const dir = mkdtempSync(join(tmpdir(), "ss-"));
  const run = startRun(dir, "recipe_faceless_short", "r1");
  assert.equal(validateAgainst("run.v1", run).length, 0);
  const b1 = beginStep(dir, "r1", "script_write", { idea: "x" });
  assert.equal(b1.skip, false);
  finishStep(dir, "r1", "script_write", b1.inputs_hash, "completed", { output_path: "scripts/a.json", total_steps: 4 });
  const b2 = beginStep(dir, "r1", "script_write", { idea: "x" });
  assert.equal(b2.skip, true); assert.equal(b2.output_path, "scripts/a.json");
  assert.equal(beginStep(dir, "r1", "script_write", { idea: "y" }).skip, false);
  finishStep(dir, "r1", "wireframe", "h", "input_required");
  assert.equal(loadRun(dir, "r1").status, "input_required");
  assert.equal(loadRun(dir, "r1").progress, 0.25);
});

test("asset_register dedupes by sha256 and defaults to unknown license", () => {
  const dir = mkdtempSync(join(tmpdir(), "ss-"));
  mkdirSync(join(dir, "assets", "sfx"), { recursive: true });
  writeFileSync(join(dir, "assets", "sfx", "pop.wav"), "RIFF-fake");
  const a = registerAsset({ project_path: dir, path: "assets/sfx/pop.wav", type: "sfx" });
  assert.equal(a.license.license_id, "unknown"); assert.equal(a.license.commercial_ok, false); assert.equal(a.deduped, false);
  const b = registerAsset({ project_path: dir, path: "assets/sfx/pop.wav" });
  assert.equal(b.deduped, true); assert.equal(b.asset_id, a.asset_id);
  const c = registerAsset({ project_path: dir, path: "assets/sfx/pop.wav", asset_id: "sfx_pop", license_id: "CC0", commercial_ok: true, source: "Pixabay" });
  assert.equal(c.asset_id, "sfx_pop"); assert.equal(c.license.commercial_ok, true);
  assert.throws(() => registerAsset({ project_path: dir, path: "nope.wav" }), (e) => e.code === "ASSET_NOT_FOUND");
});

test("library search filters and scores", () => {
  const r = searchLibrary(lib, { query: "upbeat synth", kind: "music" });
  assert.equal(r.results[0].id, "m1");
  assert.equal(searchLibrary(lib, { kind: "sfx" }).results.length, 1);
  assert.equal(searchLibrary(lib, { kind: "music", bpm_range: [120, 150] }).results.length, 2);
  assert.equal(searchLibrary(lib, { kind: "music", require_commercial: true }).results.length, 2);
  const p = placement(lib.items[0]);
  assert.equal(p.gain_db, -6); assert.equal(p.first_onset_ms, 120); assert.ok(p.loop_point_ms <= 90000);
});

test("music_select refuses high content id risk and warns on unknown license", () => {
  const r = selectMusic(lib, { mood: "energetic", bpm_range: [120, 140], platform: "shorts", duration_ms: 70000 });
  assert.deepEqual(r.picks.map((p) => p.asset_id), ["m1"]);
  const s = selectMusic(lib, { mood: "sad" });
  assert.equal(s.picks[0].asset_id, "m2");
  assert.match(s.picks[0].warnings[0], /License not confirmed/);
});
