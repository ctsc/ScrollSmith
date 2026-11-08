#!/usr/bin/env node
/**
 * originality_check: similarity versus the channel's recent episodes (history/episodes.json).
 * Script text: character 3-gram cosine similarity (threshold 0.9 fails). Structure: beat sequence + layouts + variation axes fingerprint.
 * Input: { spec_path, script_path?, project_path | history_path, last_n?: 20, text_threshold?: 0.9 }
 * Output: { pass, similarity: {max_text, max_structure, closest_episode_id}, repeated_axes[], fix_hints[] }
 * Record an episode after render with { action: "record", spec_path, script_path?, project_path }.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { readJson, writeJson, run, toolError, hashValue } from "./lib/io.mjs";

export function ngrams(text, n = 3) {
  const s = text.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, "").replace(/\s+/g, " ").trim();
  const m = new Map();
  for (let i = 0; i <= s.length - n; i++) { const g = s.slice(i, i + n); m.set(g, (m.get(g) ?? 0) + 1); }
  return m;
}

export function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (const [k, v] of a) { na += v * v; if (b.has(k)) dot += v * b.get(k); }
  for (const v of b.values()) nb += v * v;
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

export function fingerprint(spec) {
  return { beats: spec.timeline.map((r) => r.beat), layouts: spec.timeline.map((r) => r.layout), variation: spec.style?.variation ?? {}, pack: spec.style?.pack_id, hash: hashValue({ b: spec.timeline.map((r) => r.beat), l: spec.timeline.map((r) => r.layout) }) };
}

export function structureSimilarity(a, b) {
  const seq = (x, y) => { const n = Math.max(x.length, y.length); if (!n) return 1; let same = 0; for (let i = 0; i < n; i++) if (x[i] === y[i]) same++; return same / n; };
  return 0.5 * seq(a.beats, b.beats) + 0.5 * seq(a.layouts, b.layouts);
}

export function scriptText(spec, script) {
  return script?.lines ? script.lines.map((l) => l.text).join(" ") : spec.timeline.map((r) => r.narration ?? "").join(" ");
}

export function checkOriginality(spec, script, history, { last_n = 20, text_threshold = 0.9, structure_threshold = 0.95 } = {}) {
  const recent = (history.episodes ?? []).slice(-last_n);
  const mine = ngrams(scriptText(spec, script));
  const fp = fingerprint(spec);
  let maxText = 0, maxStruct = 0, closest = null;
  const axisCounts = {};
  for (const ep of recent) {
    const t = ep.script_text ? cosine(mine, ngrams(ep.script_text)) : 0;
    const s = ep.fingerprint ? structureSimilarity(fp, ep.fingerprint) : 0;
    if (t > maxText) { maxText = t; closest = ep.episode_id; }
    if (s > maxStruct) maxStruct = s;
    for (const [k, v] of Object.entries(ep.fingerprint?.variation ?? {})) if (fp.variation[k] === v) axisCounts[k] = (axisCounts[k] ?? 0) + 1;
  }
  const repeated_axes = Object.entries(axisCounts).filter(([, n]) => n >= 3).map(([k]) => k);
  const fix_hints = [];
  if (maxText >= text_threshold) fix_hints.push(`Script is ${(maxText * 100).toFixed(0)}% similar to ${closest}: rewrite the hook and payoff lines with a new angle.`);
  if (maxStruct >= structure_threshold && recent.length >= 3) fix_hints.push("Beat and layout sequence matches recent episodes: change one layout or add a twist beat.");
  for (const k of repeated_axes) fix_hints.push(`Change ${k}: the same value was used in 3 or more of the last ${recent.length} episodes (run variation_pick).`);
  return { pass: fix_hints.length === 0, similarity: { max_text: Math.round(maxText * 1000) / 1000, max_structure: Math.round(maxStruct * 1000) / 1000, closest_episode_id: closest }, repeated_axes, fix_hints, compared: recent.length };
}

export function recordEpisode(historyPath, spec, script) {
  const h = existsSync(historyPath) ? readJson(historyPath) : { episodes: [] };
  h.episodes = h.episodes.filter((e) => e.episode_id !== (spec.meta.episode_id ?? spec.meta.title));
  h.episodes.push({ episode_id: spec.meta.episode_id ?? spec.meta.title, recorded_at: new Date().toISOString(), script_text: scriptText(spec, script), fingerprint: fingerprint(spec), variation: spec.style?.variation ?? {} });
  writeJson(historyPath, h);
  return { history_path: historyPath, episodes: h.episodes.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    if (!input.spec_path) throw toolError("INVALID_INPUT", "spec_path is required");
    const historyPath = input.history_path ?? (input.project_path ? join(input.project_path, "history", "episodes.json") : null);
    if (!historyPath) throw toolError("INVALID_INPUT", "project_path or history_path is required");
    const spec = readJson(input.spec_path);
    const script = input.script_path ? readJson(input.script_path) : null;
    if (input.action === "record") return recordEpisode(historyPath, spec, script);
    return checkOriginality(spec, script, existsSync(historyPath) ? readJson(historyPath) : { episodes: [] }, input);
  });
}
