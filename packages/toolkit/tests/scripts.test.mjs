import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { estimate, expandNumbers, spokenWordCount, updateWps } from "../node/duration_estimate.mjs";
import { pickVariation, mulberry32 } from "../node/variation_pick.mjs";
import { patchSpec, nextVersionPath } from "../node/scene_plan_patch.mjs";
import { createProject } from "../node/project_create.mjs";
import { validateAgainst, listSchemaIds } from "../node/lib/validate.mjs";

test("expandNumbers speaks digits, money and percents", () => {
  assert.equal(expandNumbers("32"), "thirty two");
  assert.equal(expandNumbers("$1,200"), "one thousand two hundred dollars");
  assert.equal(expandNumbers("50%"), "fifty percent");
  assert.equal(expandNumbers("3.14"), "three point one four");
  assert.equal(spokenWordCount("Day 5: 32 coins."), 5);
});

test("estimate uses wps and pauses", () => {
  const r = estimate("One two three four five.", { voice_id: "local_default" });
  assert.equal(r.wps_used, 2.5);
  assert.equal(r.est_ms, 2000 + 120);
});

test("updateWps writes an EMA calibration", () => {
  const dir = mkdtempSync(join(tmpdir(), "ss-"));
  const a = updateWps(dir, "local_default", 3.5);
  assert.equal(a.wps, 2.8);
  assert.equal(estimate("a b c", { project_path: dir }).wps_used, 2.8);
});

test("mulberry32 is deterministic", () => {
  const a = mulberry32(7), b = mulberry32(7);
  assert.equal(a(), b());
});

test("pickVariation avoids recent values and is seeded", () => {
  const manifest = { variation_axes: ["palette_variant"], variation_values: { palette_variant: ["sunset", "ice", "toxic"] } };
  const history = [{ variation: { palette_variant: "sunset" } }, { variation: { palette_variant: "ice" } }];
  const r = pickVariation(manifest, history, 3);
  assert.equal(r.picks.palette_variant, "toxic");
  assert.deepEqual(pickVariation(manifest, [], 11).picks, pickVariation(manifest, [], 11).picks);
});

test("patchSpec reports changed ranges and bumps version path", () => {
  const spec = { timeline: [{ id: "r1", end_ms: 1000 }, { id: "r2", end_ms: 2000 }] };
  const r = patchSpec(spec, [{ op: "replace", path: "/timeline/1/end_ms", value: 2500 }]);
  assert.deepEqual(r.changed_range_ids, ["r2"]);
  assert.equal(spec.timeline[1].end_ms, 2000);
  assert.equal(nextVersionPath("specs/a.v3.json"), "specs/a.v4.json");
  assert.equal(nextVersionPath("specs/a.json"), "specs/a.v2.json");
  assert.throws(() => patchSpec(spec, [{ op: "replace", path: "/nope/1", value: 1 }]), (e) => e.code === "INVALID_INPUT" && /Invalid patch/.test(e.message));
});

test("createProject writes the folder layout", () => {
  const dir = join(mkdtempSync(join(tmpdir(), "ss-")), "proj");
  const r = createProject({ path: dir, name: "My Series" });
  assert.equal(r.project_id, "my-series");
  for (const f of ["project.json", "assets/library.json", "assets/ledger.json", "history/episodes.json", "specs", "footage"]) assert.ok(existsSync(join(dir, f)), f);
});

test("every schema compiles and error.v1 rejects extras", () => {
  assert.ok(listSchemaIds().includes("video_spec.v1"));
  assert.equal(validateAgainst("error.v1", { code: "TIMEOUT", message: "x", retryable: true }).length, 0);
  assert.equal(validateAgainst("error.v1", { code: "NOPE", message: "x", retryable: true }).length, 1);
});
