import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { applyDecisions, resolveParams } from "../node/apply_decisions.mjs";
import { DETECTORS, snapToWordBoundary } from "../node/lib/detectors.mjs";
import { validateAgainst } from "../node/lib/validate.mjs";
import { validateSpec } from "../node/scene_plan_validate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const footage = () => JSON.parse(readFileSync(join(here, "fixtures", "footage_index.sample.json"), "utf8"));
const registry = (cat) => JSON.parse(readFileSync(join(here, "..", "registry", `${cat}.json`), "utf8")).decisions;

function editSpec() {
  return {
    spec_version: "1.0",
    meta: { project_id: "p", title: "t", seed: 1, format_type: "talking_head", local_only: true },
    format: { aspect: "9:16", width: 1080, height: 1920, fps: 30, duration_ms: 4000, platforms: ["tiktok"], safe_zone_preset: "universal_strict" },
    style: { pack_id: "brand_clean_talking_head", pack_version: "1.0.0" },
    audio: {},
    sources: [{ source_id: "src1", path: "footage/take1.mp4" }],
    timeline: [{ id: "e1", start_ms: 0, end_ms: 4000, beat: "hook", layout: "talking_head_full", layers: [{ id: "v", kind: "source_video", slot: "source_video" }], source_id: "src1", source_in_ms: 0, source_out_ms: 4000, caption_state: "on" }],
  };
}

test("every registry file validates against edit_decision.v1 and ids are unique and consistent", () => {
  const files = readdirSync(join(here, "..", "registry")).filter((f) => f.endsWith(".json"));
  assert.ok(files.length >= 13);
  const seen = new Set();
  let total = 0;
  for (const f of files) {
    const cat = f.replace(/\.json$/, "");
    for (const d of registry(cat)) {
      assert.equal(validateAgainst("edit_decision.v1", d).length, 0, `${d.id}: ${JSON.stringify(validateAgainst("edit_decision.v1", d)[0])}`);
      assert.equal(d.category, cat, d.id);
      assert.ok(d.id.startsWith(`${cat}.`), d.id);
      assert.ok(!seen.has(d.id), `duplicate ${d.id}`);
      seen.add(d.id);
      total++;
    }
  }
  assert.ok(total >= 80, `registry has ${total} decisions`);
});

test("snapToWordBoundary never lands inside a word", () => {
  const w = footage().words;
  assert.equal(snapToWordBoundary(300, w), 200);
  assert.equal(snapToWordBoundary(600, w), 650);
  assert.equal(snapToWordBoundary(1000, w), 1000);
});

test("detectors resolve silences, fillers, emphasis and sentences", () => {
  const f = footage();
  assert.equal(DETECTORS.silence(f, { min_gap_ms: 400 }).length, 2);
  assert.equal(DETECTORS.filler_word(f).length, 1);
  assert.equal(DETECTORS.emphasis_word(f, { min_score: 1 })[0].meta.word, "three");
  assert.equal(DETECTORS.sentence_boundary(f).length, 2);
  assert.equal(DETECTORS.face_present(f).length, 1);
});

test("silence_remove cuts gaps, splits the range and keeps cuts on word boundaries", () => {
  const r = applyDecisions(editSpec(), [footage()], registry("cut_pacing"), [{ decision_id: "cut_pacing.silence_remove", param_values: { keep_ms: 0 } }]);
  assert.equal(r.applied["cut_pacing.silence_remove"], 1);
  assert.ok(r.spec.format.duration_ms < 4000);
  assert.ok(r.spec.timeline.length >= 2);
  const v = validateSpec(r.spec, { footageIndexes: { src1: footage() } });
  assert.equal(v.errors.filter((e) => e.rule === "F1" || e.rule === "F2" || e.rule === "T1").length, 0, JSON.stringify(v.errors));
  assert.ok(r.spec.timeline.every((x, i) => i === 0 || x.transition_in?.audio_crossfade_ms === 30));
  assert.equal(r.spec.decision_log.length, r.decision_log.length);
});

test("filler_remove cuts the um", () => {
  const r = applyDecisions(editSpec(), [footage()], registry("cut_pacing"), [{ decision_id: "cut_pacing.filler_remove" }]);
  assert.equal(r.applied["cut_pacing.filler_remove"], 1);
  assert.equal(r.decision_log[0].params.cut_start_ms, 1220);
  assert.equal(r.decision_log[0].params.cut_end_ms, 1380);
});

test("punch_on_emphasis_word adds a zoom animation and respects shot edges", () => {
  const r = applyDecisions(editSpec(), [footage()], registry("zoom_framing"), [{ decision_id: "zoom_framing.punch_on_emphasis_word", param_values: { scale: 1.5, min_score: 1 } }]);
  const anim = r.spec.timeline[0].layers[0].animations[0];
  assert.equal(anim.primitive, "zoom_punch");
  assert.equal(anim.params.scale, 1.25);
  assert.equal(anim.start_ms, 3000);
});

test("skips decisions for other formats and warns on conflicts", () => {
  const s = editSpec(); s.meta.format_type = "faceless";
  const r = applyDecisions(s, [footage()], registry("cut_pacing"), [{ decision_id: "cut_pacing.silence_remove" }, { decision_id: "cut_pacing.breath_remove" }]);
  assert.ok(r.warnings.some((w) => /does not apply/.test(w)));
  assert.ok(r.warnings.some((w) => /conflicts/.test(w)));
});

test("resolveParams clamps to min and max", () => {
  const d = registry("zoom_framing")[0];
  assert.equal(resolveParams(d, { scale: 9 }).scale, 1.25);
  assert.equal(resolveParams(d).ms, 400);
});
