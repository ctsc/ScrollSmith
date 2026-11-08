#!/usr/bin/env node
/**
 * asset_library_search: search the user's local library index (assets/library.json). No network, no downloads.
 * Input: { project_path | library_path, query?, kind?, min_ms?, max_ms?, bpm_range?: [lo, hi], mood?, limit?: 10, require_commercial?: false }
 * Output: { results: [{ id, path, kind, duration_ms, bpm, license, score, placement_measurements }] }
 * placement_measurements: recommended gain (dB) toward -18 LUFS for music or -9 dB for SFX, offset to the first onset, and a bar-aligned loop point when bpm is known.
 */
import { join } from "node:path";
import { readJson, run, toolError } from "./lib/io.mjs";

export function placement(item) {
  const targetLufs = item.kind === "music" ? -18 : item.kind === "sfx" ? -12 : -16;
  const gain_db = item.loudness_lufs !== undefined ? Math.round((targetLufs - item.loudness_lufs) * 10) / 10 : null;
  const first_onset_ms = item.onsets_ms?.[0] ?? 0;
  let loop_point_ms = null;
  if (item.bpm && item.duration_ms) {
    const bar = (60000 / item.bpm) * 4;
    loop_point_ms = Math.floor((item.duration_ms - first_onset_ms) / bar) * bar + first_onset_ms;
  }
  return { gain_db, first_onset_ms, loop_point_ms };
}

export function searchLibrary(library, q = {}) {
  const terms = (q.query ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const results = [];
  for (const item of library.items ?? []) {
    if (q.kind && item.kind !== q.kind) continue;
    if (q.min_ms && (item.duration_ms ?? 0) < q.min_ms) continue;
    if (q.max_ms && (item.duration_ms ?? Infinity) > q.max_ms) continue;
    if (q.bpm_range && (!item.bpm || item.bpm < q.bpm_range[0] || item.bpm > q.bpm_range[1])) continue;
    if (q.require_commercial && item.license?.commercial_ok !== true) continue;
    const hay = [item.path, ...(item.tags ?? []), ...(item.mood ?? [])].join(" ").toLowerCase();
    let score = terms.length ? terms.filter((t) => hay.includes(t)).length / terms.length : 1;
    if (q.mood && (item.mood ?? []).includes(q.mood)) score += 0.5;
    if (terms.length && score === 0) continue;
    results.push({ id: item.id, path: item.path, kind: item.kind, duration_ms: item.duration_ms, bpm: item.bpm, tags: item.tags, license: item.license, score: Math.round(score * 100) / 100, placement_measurements: placement(item) });
  }
  results.sort((a, b) => b.score - a.score || (a.license?.commercial_ok === true ? -1 : 1));
  return { results: results.slice(0, q.limit ?? 10), total: results.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    const p = input.library_path ?? (input.project_path ? join(input.project_path, "assets", "library.json") : null);
    if (!p) throw toolError("INVALID_INPUT", "project_path or library_path is required");
    return searchLibrary(readJson(p), input);
  });
}
