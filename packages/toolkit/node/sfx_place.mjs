#!/usr/bin/env node
/**
 * sfx_place: auto-place whooshes, pops, clicks and risers from the USER'S SFX library on transitions, text-ins,
 * counters and reveals. Rule table, default gain -9 dB, minimum spacing 300 ms, never within 150 ms of an emphasis word.
 * Input: { spec_path, project_path | library_path, min_spacing_ms?: 300, gain_db?: -9, words_path?, out_path? }
 * Output: { spec_path, placed: [{range_id, role, asset_id, at_ms}], missing_roles[] }
 */
import { join } from "node:path";
import { readJson, writeJson, run, toolError } from "./lib/io.mjs";
import { nextVersionPath } from "./scene_plan_patch.mjs";
import { searchLibrary } from "./asset_library_search.mjs";

const ROLE_QUERIES = { whoosh: "whoosh swish transition", pop: "pop click ui", click: "click tick", riser: "riser build up", impact: "impact hit boom" };

export function placeSfx(spec, library, { min_spacing_ms = 300, gain_db = -9, words = [] } = {}) {
  const pick = {};
  const missing = [];
  for (const [role, q] of Object.entries(ROLE_QUERIES)) {
    const r = searchLibrary(library, { query: q, kind: "sfx", require_commercial: true, limit: 1 }).results[0] ?? searchLibrary(library, { query: role, kind: "sfx", limit: 1 }).results[0];
    if (r) pick[role] = r; else missing.push(role);
  }
  const placed = [];
  let lastAbs = -Infinity;
  const nearEmphasis = (absMs) => words.some((w) => w.emphasis && Math.abs(w.startMs - absMs) < 150);
  const add = (r, role, relMs) => {
    const asset = pick[role];
    if (!asset) return;
    const abs = r.start_ms + relMs;
    if (abs - lastAbs < min_spacing_ms || nearEmphasis(abs)) return;
    r.sfx = [...(r.sfx ?? []), { asset_id: asset.id, at_ms: relMs, gain_db: role === "riser" ? gain_db - 3 : gain_db, sync: "absolute" }];
    placed.push({ range_id: r.id, role, asset_id: asset.id, at_ms: relMs });
    lastAbs = abs;
  };
  spec.timeline.forEach((r, i) => {
    if (i > 0 && (r.transition_in?.type ?? "cut") !== "cut") add(r, "whoosh", 0);
    for (const l of r.layers) {
      if (["text", "hud", "callout", "sticker", "lower_third"].includes(l.kind)) add(r, "pop", Math.max(0, (l.animations?.[0]?.start_ms ?? r.start_ms) - r.start_ms));
      if (l.kind === "counter") add(r, "click", Math.max(0, (l.animations?.[0]?.start_ms ?? r.start_ms) - r.start_ms));
      for (const a of l.animations ?? []) if (a.primitive === "zoom_punch") add(r, "impact", Math.max(0, a.start_ms - r.start_ms));
    }
    if (r.beat === "payoff" && i > 0) add(spec.timeline[i - 1], "riser", Math.max(0, spec.timeline[i - 1].end_ms - spec.timeline[i - 1].start_ms - 1200));
  });
  const assets = spec.assets ?? [];
  for (const a of Object.values(pick)) if (!assets.some((x) => x.asset_id === a.id)) assets.push({ asset_id: a.id, type: "sfx", path: a.path, license: { source: a.license?.source, license_id: a.license?.license_id, attribution: a.license?.attribution ?? "", commercial_ok: a.license?.commercial_ok === true, content_id_risk: a.license?.content_id_risk ?? "none" } });
  spec.assets = assets;
  return { spec, placed, missing_roles: missing };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    if (!input.spec_path) throw toolError("INVALID_INPUT", "spec_path is required");
    const libPath = input.library_path ?? (input.project_path ? join(input.project_path, "assets", "library.json") : null);
    if (!libPath) throw toolError("INVALID_INPUT", "project_path or library_path is required");
    const words = input.words_path ? readJson(input.words_path).words : [];
    const r = placeSfx(readJson(input.spec_path), readJson(libPath), { ...input, words });
    const outPath = input.out_path ?? nextVersionPath(input.spec_path);
    writeJson(outPath, r.spec);
    return { spec_path: outPath, placed: r.placed, missing_roles: r.missing_roles };
  });
}
