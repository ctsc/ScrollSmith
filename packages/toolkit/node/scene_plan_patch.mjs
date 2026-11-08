#!/usr/bin/env node
/**
 * scene_plan_patch: apply RFC 6902 JSON Patch ops to a spec, bump the version file, report changed ranges.
 * Input: { spec_path, ops: Operation[], out_path? }
 * Output: { spec_path, version, changed_range_ids[], removed_range_ids[], added_range_ids[] }
 */
import pkg from "fast-json-patch";
import { readJson, writeJson, run, hashValue, toolError } from "./lib/io.mjs";

const { applyPatch, validate } = pkg;

export function rangeHashes(spec) {
  return Object.fromEntries((spec.timeline ?? []).map((r) => [r.id, hashValue(r)]));
}

export function patchSpec(spec, ops) {
  const err = validate(ops, spec);
  if (err) throw toolError("INVALID_INPUT", `Invalid patch: ${err.name} at op ${err.index}`, { path: err.operation?.path, fix_hint: "Check the op, path and value of the failing operation.", details: { name: err.name, index: err.index } });
  const before = rangeHashes(spec);
  const next = applyPatch(structuredClone(spec), ops, true, false).newDocument;
  const after = rangeHashes(next);
  const changed = Object.keys(after).filter((id) => before[id] && before[id] !== after[id]);
  const removed = Object.keys(before).filter((id) => !after[id]);
  const added = Object.keys(after).filter((id) => !before[id]);
  return { spec: next, changed_range_ids: changed, removed_range_ids: removed, added_range_ids: added };
}

export function nextVersionPath(specPath) {
  const m = specPath.match(/^(.*)\.v(\d+)\.json$/);
  return m ? `${m[1]}.v${Number(m[2]) + 1}.json` : specPath.replace(/\.json$/, ".v2.json");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    if (!input.spec_path || !Array.isArray(input.ops)) throw toolError("INVALID_INPUT", "spec_path and ops[] are required");
    const spec = readJson(input.spec_path);
    const r = patchSpec(spec, input.ops);
    const outPath = input.out_path ?? nextVersionPath(input.spec_path);
    writeJson(outPath, r.spec);
    return { spec_path: outPath, version: outPath.match(/\.v(\d+)\.json$/)?.[1] ?? null, changed_range_ids: r.changed_range_ids, removed_range_ids: r.removed_range_ids, added_range_ids: r.added_range_ids };
  });
}
