#!/usr/bin/env node
/**
 * music_select: pick a track from the USER'S library by mood, BPM and length. Refuses commercial_ok false.
 * Input: { project_path | library_path, mood?, bpm_range?, min_ms, platform?: "shorts"|"tiktok"|..., duration_ms?, limit?: 3 }
 * Output: { picks: [{ asset_id, path, bpm, license, score, warnings[] }] }
 */
import { join } from "node:path";
import { readJson, run, toolError } from "./lib/io.mjs";
import { searchLibrary } from "./asset_library_search.mjs";

export function selectMusic(library, q = {}) {
  const base = searchLibrary(library, { kind: "music", mood: q.mood, bpm_range: q.bpm_range, min_ms: q.min_ms, limit: 100 }).results;
  const picks = [];
  for (const r of base) {
    if (r.license?.commercial_ok === false) continue;
    const warnings = [];
    if (r.license?.commercial_ok !== true) warnings.push("License not confirmed: confirm on the source page and set commercial_ok true before the final render.");
    if (r.license?.content_id_risk === "high") continue;
    if (r.license?.content_id_risk === "unknown") warnings.push("Content ID risk unknown.");
    if (q.platform === "shorts" && (q.duration_ms ?? 0) > 60000 && !/youtube audio library/i.test(r.license?.source ?? "")) warnings.push("Short over 60 s: only YouTube Audio Library music is claim-free per YouTube Help.");
    let score = r.score;
    if (q.bpm_range && r.bpm) { const mid = (q.bpm_range[0] + q.bpm_range[1]) / 2; score += Math.max(0, 1 - Math.abs(r.bpm - mid) / 40); }
    if (r.bpm && r.bpm >= 120) score += 0.2;
    picks.push({ asset_id: r.id, path: r.path, bpm: r.bpm, duration_ms: r.duration_ms, license: r.license, score: Math.round(score * 100) / 100, placement_measurements: r.placement_measurements, warnings });
  }
  picks.sort((a, b) => b.score - a.score);
  return { picks: picks.slice(0, q.limit ?? 3), considered: base.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    const p = input.library_path ?? (input.project_path ? join(input.project_path, "assets", "library.json") : null);
    if (!p) throw toolError("INVALID_INPUT", "project_path or library_path is required");
    return selectMusic(readJson(p), input);
  });
}
