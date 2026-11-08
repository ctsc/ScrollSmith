#!/usr/bin/env node
/**
 * variation_pick: choose seeded variation axes for an episode, avoiding values used in the last N episodes.
 * Input: { pack_manifest_path | pack_manifest, series_path?, history_path?, seed, avoid_last?: 3 }
 * Output: { seed, picks: {axis: value}, avoided: {axis: [values]} }
 */
import { existsSync } from "node:fs";
import { readJson, run } from "./lib/io.mjs";

/** mulberry32: small seeded PRNG, deterministic across platforms. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickVariation(manifest, history = [], seed = 1, avoidLast = 3) {
  const rng = mulberry32(seed);
  const recent = history.slice(-avoidLast);
  const picks = {}, avoided = {};
  for (const axis of manifest.variation_axes ?? []) {
    const values = manifest.variation_values?.[axis] ?? Object.keys(manifest.tokens?.palette_variants ?? {});
    if (!values.length) continue;
    const used = recent.map((h) => h.variation?.[axis]).filter(Boolean);
    const pool = values.filter((v) => !used.includes(v));
    const from = pool.length ? pool : values;
    picks[axis] = from[Math.floor(rng() * from.length)];
    avoided[axis] = used;
  }
  return { seed, picks, avoided };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    const manifest = input.pack_manifest ?? readJson(input.pack_manifest_path);
    const history = input.history_path && existsSync(input.history_path) ? readJson(input.history_path).episodes ?? [] : [];
    return pickVariation(manifest, history, input.seed ?? 1, input.avoid_last ?? 3);
  });
}
