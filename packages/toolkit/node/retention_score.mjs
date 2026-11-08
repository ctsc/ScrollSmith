#!/usr/bin/env node
/**
 * retention_score: explainable pre-publish heuristic (0 to 100). NOT a prediction of performance.
 * Input: { spec_path, script_path?, captions_path? }
 * Output: { score, factors: {hook_by_3s, visual_change_rate, open_loops, payoff_position, length_fit, caption_coverage}, notes[] }
 */
import { readJson, run, toolError } from "./lib/io.mjs";

export function scoreSpec(spec, script, captions) {
  const dur = spec.format.duration_ms;
  const hook = spec.timeline.find((r) => r.beat === "hook");
  const hook_by_3s = hook && hook.start_ms === 0 && hook.end_ms <= 3000 ? 1 : hook ? 0.5 : 0;
  const changes = spec.timeline.reduce((n, r) => n + 1 + (r.camera?.move && r.camera.move !== "static" ? 1 : 0) + r.layers.reduce((m, l) => m + (l.animations?.length ?? 0), 0), 0);
  const perMin = (changes / dur) * 60000;
  const visual_change_rate = Math.min(1, perMin / 30);
  let open_loops = 0.5;
  if (script?.lines) {
    const opened = script.lines.filter((l) => l.open_loop).length;
    const closed = script.lines.filter((l) => l.closes_loop_id).length;
    open_loops = opened === 0 ? 0.4 : Math.min(1, closed / opened);
  } else if (spec.timeline.some((r) => /loop|question|reveal|what happens/i.test(r.retention_purpose ?? ""))) open_loops = 0.7;
  const payoff = spec.timeline.find((r) => r.beat === "payoff");
  const payoff_position = payoff ? (payoff.start_ms / dur >= 0.6 ? 1 : payoff.start_ms / dur >= 0.4 ? 0.7 : 0.4) : 0.2;
  const secs = dur / 1000;
  const length_fit = secs >= 20 && secs <= 60 ? 1 : secs < 20 ? 0.6 : secs <= 90 ? 0.8 : 0.5;
  let caption_coverage = 0.5;
  if (captions?.pages?.length) {
    const covered = captions.pages.reduce((n, p) => n + (p.endMs - p.startMs), 0);
    caption_coverage = Math.min(1, covered / dur);
  } else if (spec.captions?.preset) caption_coverage = 0.8;
  const weights = { hook_by_3s: 0.3, visual_change_rate: 0.2, open_loops: 0.15, payoff_position: 0.15, length_fit: 0.1, caption_coverage: 0.1 };
  const factors = { hook_by_3s, visual_change_rate, open_loops, payoff_position, length_fit, caption_coverage };
  const score = Math.round(Object.entries(weights).reduce((s, [k, w]) => s + w * factors[k], 0) * 100);
  const notes = ["Heuristic with house weights; calibrate against your own analytics. Not a prediction of views."];
  if (hook_by_3s < 1) notes.push("Hook does not resolve inside the first 3 s.");
  if (visual_change_rate < 0.7) notes.push(`About ${perMin.toFixed(0)} visual changes per minute; the house target is 30 or more for short-form.`);
  if (payoff_position < 1) notes.push("Payoff arrives early; viewers who got the payoff leave.");
  return { score, factors, notes };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    if (!input.spec_path) throw toolError("INVALID_INPUT", "spec_path is required");
    return scoreSpec(readJson(input.spec_path), input.script_path ? readJson(input.script_path) : null, input.captions_path ? readJson(input.captions_path) : null);
  });
}
