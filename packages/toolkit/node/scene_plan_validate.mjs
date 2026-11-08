#!/usr/bin/env node
/**
 * scene_plan_validate: schema check plus rules T1 to F7 for a video_spec.v1.
 * Input: { spec_path, footage_index_paths?: string[], ledger_path?, beats_path?, loop_seal_path?, wps? }
 * Output: { valid, errors[], warnings[], metrics }
 */
import { readJson, run, toolError } from "./lib/io.mjs";
import { validateAgainst, loadData } from "./lib/validate.mjs";
import { RULES } from "./lib/rules.mjs";

export function validateSpec(spec, ctx = {}) {
  const schemaErrors = validateAgainst("video_spec.v1", spec);
  if (schemaErrors.length) return { valid: false, errors: schemaErrors.map((e) => ({ ...e, rule: "SCHEMA", severity: "error" })), warnings: [], metrics: {} };
  const full = { layouts: loadData("layouts").layouts, safeZones: loadData("safe-zones"), ...ctx };
  const issues = Object.values(RULES).flatMap((rule) => rule(spec, full));
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warn");
  const dur = spec.format.duration_ms / 1000;
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metrics: {
      ranges: spec.timeline.length,
      duration_s: dur,
      avg_range_ms: Math.round(spec.format.duration_ms / spec.timeline.length),
      visual_changes_per_min: Math.round((spec.timeline.length / dur) * 60 * 10) / 10,
      hook_end_ms: spec.timeline.find((r) => r.beat === "hook")?.end_ms ?? null,
      rules_run: Object.keys(RULES),
    },
  };
}

function ctxFromInput(input) {
  const ctx = {};
  if (input.footage_index_paths) {
    ctx.footageIndexes = {};
    for (const p of input.footage_index_paths) { const idx = readJson(p); ctx.footageIndexes[idx.source_id] = idx; }
  }
  if (input.ledger_path) ctx.ledger = Object.fromEntries((readJson(input.ledger_path).assets ?? []).map((a) => [a.asset_id, a]));
  if (input.beats_path) ctx.beats = readJson(input.beats_path);
  if (input.loop_seal_path) ctx.loopSeal = readJson(input.loop_seal_path);
  if (input.wps) ctx.wps = input.wps;
  return ctx;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    if (!input.spec_path) throw toolError("INVALID_INPUT", "spec_path is required", { fix_hint: "Pass {\"spec_path\": \"specs/<id>.json\"}." });
    return validateSpec(readJson(input.spec_path), ctxFromInput(input));
  });
}
