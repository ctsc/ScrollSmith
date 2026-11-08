#!/usr/bin/env node
/**
 * run_state: resumable pipeline state. Persists step outputs keyed by input hash so reruns skip completed steps.
 * Input: { project_path, run_id?, recipe_id, action: "start"|"begin_step"|"complete_step"|"input_required"|"fail"|"status", step?, inputs?, output_path?, error? }
 * Output: run.v1
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { readJson, writeJson, run, hashValue, toolError } from "./lib/io.mjs";

export function runPath(projectPath, runId) {
  return join(projectPath, "runs", runId, "run.json");
}

export function loadRun(projectPath, runId) {
  const p = runPath(projectPath, runId);
  return existsSync(p) ? readJson(p) : null;
}

export function saveRun(projectPath, state) {
  writeJson(runPath(projectPath, state.run_id), state);
  return state;
}

export function startRun(projectPath, recipeId, runId = `${recipeId}-${Date.now().toString(36)}`) {
  return saveRun(projectPath, { run_id: runId, kind: "recipe", recipe_id: recipeId, status: "working", progress: 0, steps: [] });
}

/** Returns { skip: true, output_path } when the same step already completed with identical inputs. */
export function beginStep(projectPath, runId, step, inputs) {
  const state = loadRun(projectPath, runId);
  if (!state) throw toolError("INVALID_INPUT", `Run ${runId} not found`, { fix_hint: "Call run_state with action start first." });
  const h = hashValue(inputs ?? {});
  const done = state.steps.find((s) => s.step === step && s.inputs_hash === h && s.status === "completed");
  state.status = "working";
  saveRun(projectPath, state);
  return done ? { skip: true, output_path: done.output_path, inputs_hash: h } : { skip: false, inputs_hash: h };
}

export function finishStep(projectPath, runId, step, inputsHash, status, extra = {}) {
  const state = loadRun(projectPath, runId);
  if (!state) throw toolError("INVALID_INPUT", `Run ${runId} not found`);
  state.steps = state.steps.filter((s) => !(s.step === step && s.inputs_hash === inputsHash));
  state.steps.push({ step, inputs_hash: inputsHash, status, output_path: extra.output_path, finished_at: new Date().toISOString() });
  if (status === "input_required") state.status = "input_required";
  else if (status === "failed") { state.status = "failed"; if (extra.error) state.error = extra.error; }
  else state.status = "working";
  if (extra.total_steps) state.progress = Math.min(1, state.steps.filter((s) => s.status === "completed").length / extra.total_steps);
  return saveRun(projectPath, state);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    const { project_path, run_id, action } = input;
    if (!project_path || !action) throw toolError("INVALID_INPUT", "project_path and action are required");
    switch (action) {
      case "start": return startRun(project_path, input.recipe_id ?? "custom", run_id);
      case "status": return loadRun(project_path, run_id) ?? toolError("INVALID_INPUT", `Run ${run_id} not found`);
      case "begin_step": return beginStep(project_path, run_id, input.step, input.inputs);
      case "complete_step": return finishStep(project_path, run_id, input.step, input.inputs_hash ?? hashValue(input.inputs ?? {}), "completed", input);
      case "input_required": return finishStep(project_path, run_id, input.step, input.inputs_hash ?? hashValue(input.inputs ?? {}), "input_required", input);
      case "fail": return finishStep(project_path, run_id, input.step, input.inputs_hash ?? hashValue(input.inputs ?? {}), "failed", input);
      default: throw toolError("INVALID_INPUT", `Unknown action ${action}`);
    }
  });
}
