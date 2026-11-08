#!/usr/bin/env node
/**
 * beat_sync_apply: snap range boundaries to the nearest beat within a tolerance when the narration still fits.
 * Input: { spec_path, beats_path, mode?: "beat"|"downbeat", tolerance_ms?: 250, wps?, out_path? }
 * Output: { spec_path, snapped: [{range_id, from_ms, to_ms}], skipped: [{range_id, reason}] }
 */
import { readJson, writeJson, run, toolError } from "./lib/io.mjs";
import { nextVersionPath } from "./scene_plan_patch.mjs";
import { spokenWordCount, pauseMs } from "./duration_estimate.mjs";

export function snapToBeats(spec, beats, { mode = "beat", tolerance_ms = 250, wps = 2.5 } = {}) {
  const grid = (mode === "downbeat" ? beats.downbeats_ms : beats.beats_ms) ?? beats.beats_ms;
  if (!grid?.length) throw toolError("INVALID_INPUT", "beats.json has no beats_ms");
  const nearest = (t) => grid.reduce((b, x) => (Math.abs(x - t) < Math.abs(b - t) ? x : b), grid[0]);
  const snapped = [], skipped = [];
  const tl = spec.timeline;
  for (let i = 1; i < tl.length; i++) {
    const prev = tl[i - 1], r = tl[i];
    const target = nearest(r.start_ms);
    if (target === r.start_ms) continue;
    if (Math.abs(target - r.start_ms) > tolerance_ms) { skipped.push({ range_id: r.id, reason: `nearest ${mode} is ${Math.abs(target - r.start_ms)} ms away` }); continue; }
    const prevNeed = prev.narration ? Math.round((spokenWordCount(prev.narration) / wps) * 1000 + pauseMs(prev.narration)) : 0;
    const curNeed = r.narration ? Math.round((spokenWordCount(r.narration) / wps) * 1000 + pauseMs(r.narration)) : 0;
    if (target - prev.start_ms < prevNeed || r.end_ms - target < curNeed) { skipped.push({ range_id: r.id, reason: "narration would not fit after the snap" }); continue; }
    snapped.push({ range_id: r.id, from_ms: r.start_ms, to_ms: target });
    prev.end_ms = target; r.start_ms = target;
    r.beat_sync = { ...(r.beat_sync ?? {}), snap_cuts_to: mode };
  }
  return { spec, snapped, skipped };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    if (!input.spec_path || !input.beats_path) throw toolError("INVALID_INPUT", "spec_path and beats_path are required");
    const r = snapToBeats(readJson(input.spec_path), readJson(input.beats_path), input);
    const outPath = input.out_path ?? nextVersionPath(input.spec_path);
    writeJson(outPath, r.spec);
    return { spec_path: outPath, snapped: r.snapped, skipped: r.skipped };
  });
}
