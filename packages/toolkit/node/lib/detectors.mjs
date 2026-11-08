/**
 * Detectors resolve a decision's detector {kind, args} to a list of moments or spans in a footage_index.
 * Every detector is a pure function (index, args) => [{ startMs, endMs, meta? }].
 */

const WORD_SNAP_MS = 20;

export function snapToWordBoundary(t, words, preferSilence = true) {
  const inside = words.find((w) => t > w.startMs + WORD_SNAP_MS && t < w.endMs - WORD_SNAP_MS);
  if (!inside) return t;
  return t - inside.startMs < inside.endMs - t ? inside.startMs : inside.endMs;
}

export function silence(index, args = {}) {
  const min = args.min_gap_ms ?? args.max_gap_ms ?? 400;
  return (index.silences ?? []).filter((s) => s.endMs - s.startMs >= min).map((s) => ({ startMs: s.startMs, endMs: s.endMs }));
}

export function filler_word(index, args = {}) {
  const list = new Set((args.words ?? ["um", "uh", "erm", "hmm", "like", "you know", "sort of", "kind of"]).map((w) => w.toLowerCase()));
  const fromIndex = (index.fillers ?? []).map((f) => ({ startMs: f.startMs, endMs: f.endMs, meta: { text: f.text.trim() } }));
  if (fromIndex.length) return fromIndex;
  return (index.words ?? []).filter((w) => list.has(w.text.trim().toLowerCase().replace(/[^a-z' ]/g, ""))).map((w) => ({ startMs: w.startMs, endMs: w.endMs, meta: { text: w.text.trim() } }));
}

export function emphasis_word(index, args = {}) {
  const minScore = args.min_score ?? 1.0;
  const words = index.words ?? [];
  return (index.emphasis_candidates ?? []).filter((c) => c.score >= minScore && words[c.word_index]).map((c) => ({ startMs: words[c.word_index].startMs, endMs: words[c.word_index].endMs, meta: { word: words[c.word_index].text.trim(), score: c.score, reason: c.reason } }));
}

export function sentence_boundary(index) {
  const s = index.sentences ?? [];
  if (s.length) return s.map((x) => ({ startMs: x.startMs, endMs: x.endMs }));
  const words = index.words ?? [];
  const out = [];
  let start = words[0]?.startMs ?? 0;
  for (const w of words) if (/[.!?]$/.test(w.text.trim())) { out.push({ startMs: start, endMs: w.endMs }); start = w.endMs; }
  return out;
}

export function topic_change(index, args = {}) {
  const gap = args.min_gap_ms ?? 900;
  const sents = sentence_boundary(index);
  const out = [];
  for (let i = 1; i < sents.length; i++) if (sents[i].startMs - sents[i - 1].endMs >= gap) out.push({ startMs: sents[i].startMs, endMs: sents[i].startMs });
  return out;
}

export function scene_cut(index) {
  return (index.shots ?? []).slice(1).map((s) => ({ startMs: s.startMs, endMs: s.startMs }));
}

export function face_present(index, args = {}) {
  const minMs = args.min_ms ?? 0;
  return (index.faces ?? []).flatMap((f) => {
    const t = f.samples.map((s) => s.t_ms).sort((a, b) => a - b);
    return t.length ? [{ startMs: t[0], endMs: t[t.length - 1], meta: { track_id: f.track_id } }] : [];
  }).filter((s) => s.endMs - s.startMs >= minMs);
}

export function beat(index, args = {}, ctx = {}) {
  const grid = args.downbeats ? ctx.beats?.downbeats_ms : ctx.beats?.beats_ms;
  return (grid ?? []).map((t) => ({ startMs: t, endMs: t }));
}

export function keyword(index, args = {}) {
  const list = new Set((args.words ?? []).map((w) => w.toLowerCase()));
  return (index.words ?? []).filter((w) => list.has(w.text.trim().toLowerCase().replace(/[^\p{L}\p{N}]/gu, ""))).map((w) => ({ startMs: w.startMs, endMs: w.endMs, meta: { word: w.text.trim() } }));
}

export function time_range(index, args = {}) {
  return [{ startMs: args.start_ms ?? 0, endMs: args.end_ms ?? index.duration_ms }];
}

export function always(index) {
  return [{ startMs: 0, endMs: index.duration_ms }];
}

export const DETECTORS = { silence, filler_word, emphasis_word, sentence_boundary, topic_change, scene_cut, face_present, beat, keyword, time_range, always };
