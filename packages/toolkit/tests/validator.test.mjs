import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateSpec } from "../node/scene_plan_validate.mjs";
import { RULES } from "../node/lib/rules.mjs";
import { loadData } from "../node/lib/validate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const spec = () => JSON.parse(readFileSync(join(here, "fixtures", "cubestory.spec.json"), "utf8"));
const footage = () => JSON.parse(readFileSync(join(here, "fixtures", "footage_index.sample.json"), "utf8"));
const ctx = () => ({ layouts: loadData("layouts").layouts, safeZones: loadData("safe-zones") });
const codes = (issues) => issues.map((i) => i.rule);

test("fixture spec is valid", () => {
  const r = validateSpec(spec());
  assert.equal(r.valid, true, JSON.stringify(r.errors));
  assert.equal(r.metrics.ranges, 4);
});

test("schema failure reports path and fix_hint", () => {
  const s = spec(); delete s.format.fps;
  const r = validateSpec(s);
  assert.equal(r.valid, false);
  assert.equal(r.errors[0].rule, "SCHEMA");
  assert.match(r.errors[0].fix_hint, /fps/);
});

test("T1 gap, overlap, duration mismatch", () => {
  const s = spec(); s.timeline[1].start_ms = 2600;
  assert.deepEqual(codes(RULES.T1(s)), ["T1"]);
  const o = spec(); o.timeline[1].start_ms = 2400;
  assert.deepEqual(codes(RULES.T1(o)), ["T1"]);
  const d = spec(); d.format.duration_ms = 13000;
  assert.deepEqual(codes(RULES.T1(d)), ["T1"]);
  const g = spec(); g.timeline[1].start_ms = 2600; g.timeline[1].allow_gap = true;
  assert.deepEqual(RULES.T1(g), []);
});

test("T2 hook must end by 3000 ms", () => {
  const s = spec(); s.timeline[0].end_ms = 3500; s.timeline[1].start_ms = 3500;
  assert.equal(RULES.T2(s)[0].severity, "warn");
});

test("T3 long faceless range warns", () => {
  const s = spec(); s.timeline[2].end_ms = 11000; s.timeline[3].start_ms = 11000;
  assert.equal(RULES.T3(s).length, 1);
  s.meta.format_type = "talking_head";
  assert.equal(RULES.T3(s).length, 0);
});

test("T4 narration must fit the range", () => {
  const s = spec(); s.timeline[0].narration = "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen";
  const r = RULES.T4(s, { wps: 2.5 });
  assert.equal(r.length, 1); assert.equal(r[0].severity, "error");
  assert.match(r[0].fix_hint, /words/);
});

test("S1 text outside safe zone and unknown slot", () => {
  const s = spec(); s.timeline[0].layers[1].slot = "nowhere";
  assert.match(RULES.S1(s, ctx())[0].message, /unknown slot/);
  const t = spec(); t.timeline[0].layout = "tier_list"; t.timeline[0].layers[1].slot = "incoming";
  assert.equal(RULES.S1(t, ctx()).length, 1);
});

test("S2 captions must not overlap a text slot", () => {
  const s = spec(); s.timeline[0].layers[1].slot = "caption";
  assert.equal(RULES.S2(s, ctx()).length, 1);
  s.timeline[0].caption_state = "hidden_for_text";
  assert.equal(RULES.S2(s, ctx()).length, 0);
});

test("L1 font size minimums by role", () => {
  const s = spec(); s.timeline[0].layers[1].font_px = 60;
  assert.match(RULES.L1(s)[0].message, /72/);
  s.timeline[3].layers[1].font_px = 40;
  assert.equal(RULES.L1(s).length, 2);
});

test("L2 reading speed", () => {
  const s = spec(); s.timeline[0].on_screen_text = [{ text: "one two three four five six seven eight nine ten eleven", role: "title", slot: "hud_top" }];
  assert.equal(RULES.L2(s).length, 1);
});

test("P1 static long range warns", () => {
  const s = spec(); s.timeline[3].end_ms = 13000; s.format.duration_ms = 13000; s.timeline[3].layers = [];
  assert.equal(RULES.P1(s).length, 1);
});

test("A1 ledger, license and content id", () => {
  const s = spec(); s.assets[1].license.commercial_ok = false;
  assert.equal(RULES.A1(s, {}).length, 1);
  const m = spec(); m.assets[1].license.content_id_risk = "high";
  assert.match(RULES.A1(m, {})[0].message, /Content ID/);
  const u = spec(); u.assets = u.assets.filter((a) => a.asset_id !== "sfx_pop");
  assert.match(RULES.A1(u, {})[0].message, /not in the ledger/);
});

test("A2 shorts over 60 s without YouTube Audio Library music", () => {
  const s = spec(); s.format.duration_ms = 70000; s.timeline[3].end_ms = 70000; s.assets[1].license.source = "Pixabay";
  assert.equal(RULES.A2(s, {}).length, 1);
  s.assets[1].license.source = "YouTube Audio Library";
  assert.equal(RULES.A2(s, {}).length, 0);
});

test("B1 cut within one frame of a beat", () => {
  const s = spec();
  const beats = { bpm: 120, beats_ms: [0, 500, 1000, 1500, 2000, 2500, 3000] };
  assert.equal(RULES.B1(s, { beats }).length, 0);
  s.timeline[1].start_ms = 2600; s.timeline[0].end_ms = 2600;
  assert.equal(RULES.B1(s, { beats }).length, 1);
});

test("O1 loop seal", () => {
  const s = spec(); s.format.loop = { enabled: true, strategy: "state_match" };
  assert.equal(RULES.O1(s, {})[0].severity, "warn");
  assert.equal(RULES.O1(s, { loopSeal: { ssim: 0.8 } })[0].severity, "error");
  assert.equal(RULES.O1(s, { loopSeal: { ssim: 0.97, state_match: true } }).length, 0);
});

test("C1 CTA placement", () => {
  const s = spec(); s.timeline[3].beat = "payoff";
  assert.equal(RULES.C1(s).length, 1);
  const e = spec(); e.timeline[0].beat = "cta"; e.timeline[3].beat = "payoff";
  assert.equal(RULES.C1(e).length, 1);
  e.meta.cta_policy = "early";
  assert.equal(RULES.C1(e).length, 0);
});

function footageSpec() {
  const s = spec();
  s.meta.format_type = "talking_head"; s.meta.hook_first = true;
  s.sources = [{ source_id: "src1", path: "footage/take1.mp4" }];
  s.timeline = [
    { id: "e1", start_ms: 0, end_ms: 2000, beat: "hook", layout: "talking_head_full", layers: [{ id: "v", kind: "source_video", slot: "source_video" }], source_id: "src1", source_in_ms: 200, source_out_ms: 900, caption_state: "on" },
    { id: "e2", start_ms: 2000, end_ms: 12000, beat: "payoff", layout: "talking_head_full", layers: [{ id: "v", kind: "source_video", slot: "source_video" }], source_id: "src1", source_in_ms: 2000, source_out_ms: 4000, transition_in: { type: "cut", audio_crossfade_ms: 30 }, caption_state: "off" },
  ];
  return s;
}

test("F1 cut inside a word", () => {
  const s = footageSpec(); const c = { footageIndexes: { src1: footage() } };
  assert.equal(RULES.F1(s, c).length, 0);
  s.timeline[0].source_out_ms = 800;
  const r = RULES.F1(s, c);
  assert.equal(r.length, 1); assert.match(r[0].message, /back/);
});

test("F2 crossfade on every cut", () => {
  const s = footageSpec(); delete s.timeline[1].transition_in;
  assert.equal(RULES.F2(s).length, 1);
});

test("F3 face inside safe zone after crop", () => {
  const s = footageSpec(); const c = { ...ctx(), footageIndexes: { src1: footage() } };
  assert.equal(RULES.F3(s, c).length, 0);
  s.timeline[0].layers[0].props = { crop_norm: [0.5, 0.6, 0.3, 0.3] };
  assert.equal(RULES.F3(s, c).length, 1);
});

test("F4 captions over the face", () => {
  const s = footageSpec(); const c = { ...ctx(), footageIndexes: { src1: footage() } };
  const f = footage(); f.faces[0].samples.forEach((x) => (x.bbox_norm = [0.3, 0.5, 0.4, 0.2]));
  assert.equal(RULES.F4(s, { ...c, footageIndexes: { src1: f } }).length, 1);
  assert.equal(RULES.F4(s, c).length, 0);
});

test("F5 hook_first needs a hook in the first 3 s", () => {
  const s = footageSpec(); s.timeline[0].beat = "context";
  assert.equal(RULES.F5(s).length, 1);
});

test("F7 cloned voice needs consent", () => {
  const s = spec(); s.audio.voiceover.cloned_or_changed = true;
  assert.equal(RULES.F7(s).length, 1);
  s.meta.voice_consent = true;
  assert.equal(RULES.F7(s).length, 0);
});
