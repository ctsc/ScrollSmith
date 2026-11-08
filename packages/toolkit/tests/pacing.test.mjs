import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { snapToBeats } from "../node/beat_sync_apply.mjs";
import { placeSfx } from "../node/sfx_place.mjs";
import { scoreSpec } from "../node/retention_score.mjs";
import { checkOriginality, fingerprint, scriptText, ngrams, cosine } from "../node/originality_check.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const spec = () => JSON.parse(readFileSync(join(here, "fixtures", "cubestory.spec.json"), "utf8"));

test("beat_sync_apply snaps a boundary within tolerance and keeps the timeline contiguous", () => {
  const s = spec();
  const r1 = s.timeline[1];
  const beats = { beats_ms: [0, 500, 1000, 1500, 2000, r1.start_ms + 120, 4000, 5000] };
  const { spec: out, snapped, skipped } = snapToBeats(s, beats, { tolerance_ms: 250, wps: 10 });
  assert.equal(snapped.length, 1);
  assert.equal(out.timeline[0].end_ms, out.timeline[1].start_ms);
  assert.equal(out.timeline[1].start_ms, snapped[0].to_ms);
  assert.ok(skipped.every((x) => x.reason));
});

test("beat_sync_apply refuses a snap that breaks narration fit", () => {
  const s = spec();
  s.timeline[1].narration = "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen";
  const beats = { beats_ms: [s.timeline[1].start_ms + 240] };
  const { snapped, skipped } = snapToBeats(s, beats, { tolerance_ms: 250, wps: 2.5 });
  assert.equal(snapped.length, 0);
  assert.match(skipped[0].reason, /narration/);
});

const library = {
  schema_version: "asset_library.v1",
  items: [
    { id: "sfx_whoosh", kind: "sfx", path: "sfx/whoosh.wav", tags: ["whoosh", "transition"], license: { source: "own", commercial_ok: true, content_id_risk: "none" } },
    { id: "sfx_pop", kind: "sfx", path: "sfx/pop.wav", tags: ["pop", "ui"], license: { source: "own", commercial_ok: true, content_id_risk: "none" } },
  ],
};

test("sfx_place puts pops on text-ins, respects spacing and reports missing roles", () => {
  const s = spec();
  s.timeline[1].transition_in = { type: "whip", duration_ms: 200 };
  const { spec: out, placed, missing_roles } = placeSfx(s, library, { min_spacing_ms: 300 });
  assert.ok(placed.some((p) => p.role === "whoosh" && p.range_id === s.timeline[1].id));
  assert.ok(placed.some((p) => p.role === "pop"));
  assert.ok(missing_roles.includes("riser") && missing_roles.includes("click"));
  const abs = placed.map((p) => out.timeline.find((r) => r.id === p.range_id).start_ms + p.at_ms).sort((a, b) => a - b);
  for (let i = 1; i < abs.length; i++) assert.ok(abs[i] - abs[i - 1] >= 300, "spacing");
  assert.ok(out.assets.some((a) => a.asset_id === "sfx_pop" && a.license.commercial_ok));
});

test("retention_score is explainable and penalizes a late hook", () => {
  const good = scoreSpec(spec(), null, null);
  assert.ok(good.score > 0 && good.score <= 100);
  assert.equal(good.factors.hook_by_3s, 1);
  const s = spec();
  s.timeline[0].beat = "context";
  const bad = scoreSpec(s, null, null);
  assert.ok(bad.score < good.score);
  assert.ok(bad.notes.some((n) => /Hook/.test(n)));
});

test("originality_check flags a near-duplicate script and repeated variation axes", () => {
  const s = spec();
  const fp = fingerprint(s);
  const history = { episodes: [1, 2, 3].map((i) => ({ episode_id: `ep${i}`, script_text: scriptText(s, null), fingerprint: { ...fp, variation: { ...(s.style.variation ?? {}), palette: s.style.variation?.palette ?? "x" } } })) };
  s.style.variation = { ...(s.style.variation ?? {}), palette: s.style.variation?.palette ?? "x" };
  const r = checkOriginality(s, null, history);
  assert.equal(r.pass, false);
  assert.ok(r.similarity.max_text >= 0.9);
  assert.ok(r.repeated_axes.includes("palette"));
  const fresh = checkOriginality(s, null, { episodes: [] });
  assert.equal(fresh.pass, true);
});

test("ngram cosine is 1 for identical text and low for unrelated text", () => {
  assert.ok(cosine(ngrams("the cube fell"), ngrams("the cube fell")) > 0.999);
  assert.ok(cosine(ngrams("the cube fell"), ngrams("zebra quartz")) < 0.2);
});
