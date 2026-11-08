#!/usr/bin/env node
/**
 * apply_decisions: the registry executor. For each selected decision, the detector resolves moments in the
 * footage_index, the effect op (whitelisted) patches the edit_spec, and a decision_log entry is written.
 * Input: { spec_path, footage_index_paths: [], registry_path | decisions: edit_decision.v1[], selected: [{decision_id, param_values?}], beats_path?, out_path? }
 * Output: { spec_path, decision_log: [{decision_id, range_id, params}], applied: {decision_id: count}, warnings[] }
 *
 * Ops: cut (remove spans from source ranges, with crossfades), crossfade (set audio_crossfade_ms on every cut),
 * zoom (add zoom_punch animation on source_video layers at moments), crop_path (set crop keyframes),
 * overlay / layer_add (add a layer at moments), caption_style (patch captions and caption_state),
 * sfx (add sfx entries at moments), music (set music cue / duck), speed (set range speed), color (set color props),
 * reorder (move a range to the front), export_setting (patch format fields).
 */
import { readJson, writeJson, run, toolError } from "./lib/io.mjs";
import { validateAgainst } from "./lib/validate.mjs";
import { DETECTORS, snapToWordBoundary } from "./lib/detectors.mjs";
import { nextVersionPath } from "./scene_plan_patch.mjs";

const DEFAULT_XFADE = 30;

export function resolveParams(decision, values = {}) {
  const out = {};
  for (const [k, def] of Object.entries(decision.params ?? {})) {
    let v = values[k] ?? def.default;
    if (def.type === "number" || def.type === "integer") {
      if (def.min !== undefined) v = Math.max(def.min, v);
      if (def.max !== undefined) v = Math.min(def.max, v);
    }
    out[k] = v;
  }
  return out;
}

/** Fill {{param}} placeholders inside effect.args and detector.args with resolved params. */
function fill(obj, params) {
  if (typeof obj === "string") {
    const m = obj.match(/^\{\{(\w+)\}\}$/);
    return m ? params[m[1]] : obj;
  }
  if (Array.isArray(obj)) return obj.map((x) => fill(x, params));
  if (obj && typeof obj === "object") return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fill(v, params)]));
  return obj;
}

function sourceRanges(spec, sourceId) {
  return spec.timeline.map((r, i) => ({ r, i })).filter(({ r }) => r.source_id === sourceId && r.source_in_ms !== undefined);
}

/** Map a source-time moment to the timeline range that contains it. */
function rangeAt(spec, sourceId, srcMs) {
  return sourceRanges(spec, sourceId).find(({ r }) => srcMs >= r.source_in_ms && srcMs < r.source_out_ms) ?? null;
}

function relayout(spec) {
  let t = 0;
  for (const r of spec.timeline) {
    const len = r.source_in_ms !== undefined ? Math.round((r.source_out_ms - r.source_in_ms) / (r.speed ?? 1)) : r.end_ms - r.start_ms;
    r.start_ms = t; r.end_ms = t + len; t += len;
  }
  spec.format.duration_ms = t;
}

function cutSpans(spec, sourceId, spans, index, params, log, decisionId) {
  const words = index.words ?? [];
  let count = 0;
  for (const span of spans) {
    const a = snapToWordBoundary(span.startMs, words), b = snapToWordBoundary(span.endMs, words);
    const keep = params.keep_ms ?? 0;
    const cutStart = a + Math.floor(keep / 2), cutEnd = b - Math.ceil(keep / 2);
    if (cutEnd - cutStart < (params.min_cut_ms ?? 120)) continue;
    const hit = rangeAt(spec, sourceId, cutStart);
    if (!hit) continue;
    const { r, i } = hit;
    if (cutEnd >= r.source_out_ms) { r.source_out_ms = Math.max(r.source_in_ms + 100, cutStart); }
    else if (cutStart <= r.source_in_ms) { r.source_in_ms = Math.min(r.source_out_ms - 100, cutEnd); }
    else {
      const tail = structuredClone(r);
      tail.id = `${r.id}_${++count}`;
      tail.source_in_ms = cutEnd;
      tail.transition_in = { type: "cut", audio_crossfade_ms: params.crossfade_ms ?? DEFAULT_XFADE };
      tail.edit_notes = [...(r.edit_notes ?? []), { decision_id: decisionId, params: { cut: [cutStart, cutEnd] } }];
      r.source_out_ms = cutStart;
      spec.timeline.splice(i + 1, 0, tail);
    }
    r.edit_notes = [...(r.edit_notes ?? []), { decision_id: decisionId, params: { cut: [cutStart, cutEnd] } }];
    log.push({ decision_id: decisionId, range_id: r.id, params: { cut_start_ms: cutStart, cut_end_ms: cutEnd } });
  }
  relayout(spec);
  return log;
}

function videoLayer(r) {
  return r.layers.find((l) => l.kind === "source_video" || l.kind === "face_crop") ?? null;
}

function applyEffect(spec, decision, params, moments, index, ctx, log, warnings) {
  const args = fill(decision.effect.args ?? {}, params);
  const sourceId = index.source_id;
  switch (decision.effect.op) {
    case "cut":
      cutSpans(spec, sourceId, moments, index, { ...params, ...args }, log, decision.id);
      return;
    case "crossfade":
      spec.timeline.forEach((r, i) => { if (i > 0 && r.source_id) { r.transition_in = { ...(r.transition_in ?? { type: "cut" }), audio_crossfade_ms: args.ms ?? params.ms ?? DEFAULT_XFADE }; log.push({ decision_id: decision.id, range_id: r.id, params: { ms: r.transition_in.audio_crossfade_ms } }); } });
      return;
    case "zoom": {
      const maxPerMin = params.max_per_min ?? 12;
      const minGap = 60000 / maxPerMin;
      let last = -Infinity;
      for (const m of moments) {
        if (m.startMs - last < minGap) continue;
        const hit = rangeAt(spec, sourceId, m.startMs);
        if (!hit) continue;
        const { r } = hit;
        const shotLen = r.source_out_ms - r.source_in_ms;
        if (m.startMs - r.source_in_ms < 300 || r.source_out_ms - m.startMs < 300 || shotLen < 1000) continue;
        const layer = videoLayer(r);
        if (!layer) continue;
        const at = r.start_ms + Math.round((m.startMs - r.source_in_ms) / (r.speed ?? 1));
        layer.animations = [...(layer.animations ?? []), { primitive: "zoom_punch", start_ms: at, duration_ms: params.ms ?? args.ms ?? 400, params: { scale: params.scale ?? args.scale ?? 1.12, easing: args.easing ?? "spring_snappy", anchor: "face" } }];
        log.push({ decision_id: decision.id, range_id: r.id, params: { at_ms: at, scale: params.scale ?? args.scale ?? 1.12, word: m.meta?.word } });
        last = m.startMs;
      }
      return;
    }
    case "crop_path":
      for (const { r } of sourceRanges(spec, sourceId)) {
        const layer = videoLayer(r);
        if (!layer) continue;
        layer.props = { ...(layer.props ?? {}), crop_mode: args.mode ?? "face_track", crop_smoothing: params.smoothing ?? args.smoothing ?? 0.85, target_aspect: spec.format.aspect, headroom: params.headroom ?? 0.12 };
        log.push({ decision_id: decision.id, range_id: r.id, params: layer.props });
      }
      return;
    case "overlay":
    case "layer_add":
      for (const m of moments) {
        const hit = rangeAt(spec, sourceId, m.startMs) ?? { r: spec.timeline[0] };
        const r = hit.r;
        const start = r.source_in_ms !== undefined ? r.start_ms + Math.round((m.startMs - r.source_in_ms) / (r.speed ?? 1)) : r.start_ms;
        const layer = { id: `${args.kind ?? "callout"}_${r.id}_${r.layers.length}`, kind: args.kind ?? "callout", slot: args.slot ?? "caption", z: args.z ?? 20, component: args.component, props: { ...(args.props ?? {}), trigger_word: m.meta?.word }, animations: [{ primitive: args.primitive ?? "pop_in", start_ms: start, duration_ms: params.duration_ms ?? args.duration_ms ?? 1500 }] };
        r.layers.push(layer);
        log.push({ decision_id: decision.id, range_id: r.id, params: { layer_id: layer.id, at_ms: start } });
      }
      return;
    case "caption_style":
      spec.captions = { ...(spec.captions ?? {}), ...args };
      if (args.caption_state) for (const r of spec.timeline) r.caption_state = args.caption_state;
      log.push({ decision_id: decision.id, range_id: "*", params: args });
      return;
    case "sfx": {
      const spacing = params.min_spacing_ms ?? 300;
      let last = -Infinity;
      for (const m of moments) {
        if (m.startMs - last < spacing) continue;
        const hit = rangeAt(spec, sourceId, m.startMs);
        if (!hit) continue;
        const { r } = hit;
        const at = Math.round((m.startMs - r.source_in_ms) / (r.speed ?? 1));
        if (!args.asset_id) { warnings.push(`${decision.id}: no asset_id for the SFX; run sfx_place with the user's library`); return; }
        r.sfx = [...(r.sfx ?? []), { asset_id: args.asset_id, at_ms: at, gain_db: params.gain_db ?? -9, sync: args.sync ?? "absolute" }];
        log.push({ decision_id: decision.id, range_id: r.id, params: { at_ms: at } });
        last = m.startMs;
      }
      return;
    }
    case "music":
      spec.audio = spec.audio ?? {};
      spec.audio.music = { ...(spec.audio.music ?? {}), ...(args.duck_db !== undefined || params.duck_db !== undefined ? { duck_db: params.duck_db ?? args.duck_db } : {}) };
      if (args.cue) { const target = args.beat ? spec.timeline.find((r) => r.beat === args.beat) : spec.timeline.at(-1); if (target) target.music_cue = args.cue; }
      log.push({ decision_id: decision.id, range_id: "*", params: { ...args, ...params } });
      return;
    case "speed":
      for (const m of moments) { const hit = rangeAt(spec, sourceId, m.startMs); if (hit) { hit.r.speed = params.speed ?? args.speed ?? 1; log.push({ decision_id: decision.id, range_id: hit.r.id, params: { speed: hit.r.speed } }); } }
      relayout(spec);
      return;
    case "color":
      for (const { r } of sourceRanges(spec, sourceId)) { const l = videoLayer(r); if (l) { l.props = { ...(l.props ?? {}), color: { ...(l.props?.color ?? {}), ...args, ...params } }; log.push({ decision_id: decision.id, range_id: r.id, params: l.props.color }); } }
      return;
    case "reorder": {
      const idx = spec.timeline.findIndex((r) => r.id === args.range_id || r.beat === args.beat);
      if (idx > 0) { const [r] = spec.timeline.splice(idx, 1); spec.timeline.unshift(r); relayout(spec); log.push({ decision_id: decision.id, range_id: r.id, params: { moved_to: 0 } }); }
      return;
    }
    case "export_setting":
      Object.assign(spec.format, args);
      log.push({ decision_id: decision.id, range_id: "*", params: args });
      return;
    default:
      throw toolError("INVALID_INPUT", `Unknown effect op ${decision.effect.op} in ${decision.id}`, { fix_hint: "Ops must be one of the whitelisted set in edit_decision.v1." });
  }
}

export function applyDecisions(spec, indexes, decisions, selected, ctx = {}) {
  const byId = Object.fromEntries(decisions.map((d) => [d.id, d]));
  const log = [];
  const warnings = [];
  const applied = {};
  const formatType = spec.meta.format_type ?? "talking_head";
  for (const sel of selected) {
    const d = byId[sel.decision_id];
    if (!d) { warnings.push(`Unknown decision ${sel.decision_id}`); continue; }
    const schemaErrors = validateAgainst("edit_decision.v1", d);
    if (schemaErrors.length) throw toolError("INVALID_INPUT", `Decision ${d.id} is invalid: ${schemaErrors[0].message}`, { path: schemaErrors[0].path });
    for (const c of d.conflicts_with ?? []) if (selected.some((s) => s.decision_id === c)) warnings.push(`${d.id} conflicts with ${c}; both selected`);
    if (!d.applies_to.includes(formatType)) { warnings.push(`${d.id} does not apply to ${formatType}; skipped`); continue; }
    const params = resolveParams(d, sel.param_values);
    const detector = DETECTORS[d.detector.kind];
    if (!detector) throw toolError("INVALID_INPUT", `Unknown detector ${d.detector.kind}`);
    const before = log.length;
    for (const index of indexes) {
      const moments = detector(index, fill(d.detector.args ?? {}, params), ctx);
      applyEffect(spec, d, params, moments, index, ctx, log, warnings);
    }
    applied[d.id] = log.length - before;
  }
  spec.decision_log = [...(spec.decision_log ?? []), ...log];
  return { spec, decision_log: log, applied, warnings };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    if (!input.spec_path || !Array.isArray(input.footage_index_paths)) throw toolError("INVALID_INPUT", "spec_path and footage_index_paths[] are required");
    const spec = readJson(input.spec_path);
    const indexes = input.footage_index_paths.map(readJson);
    const decisions = input.decisions ?? readJson(input.registry_path).decisions;
    const ctx = input.beats_path ? { beats: readJson(input.beats_path) } : {};
    const r = applyDecisions(spec, indexes, decisions, input.selected ?? [], ctx);
    const outPath = input.out_path ?? nextVersionPath(input.spec_path);
    writeJson(outPath, r.spec);
    return { spec_path: outPath, decision_log: r.decision_log, applied: r.applied, warnings: r.warnings };
  });
}
