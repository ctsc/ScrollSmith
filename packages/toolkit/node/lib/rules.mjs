import { toolError } from "./io.mjs";
import { loadData } from "./validate.mjs";

/**
 * Validator rules for video_spec.v1 (spec section 5.3). Each rule is a pure function
 * (spec, ctx) => Issue[] where Issue = error.v1 plus { rule, severity }.
 * ctx: { layouts, safeZones, footageIndexes: {source_id: footage_index}, ledger: {asset_id: asset_ref}, words }.
 */

const issue = (rule, severity, message, path, fix_hint, details) => ({
  ...toolError("SPEC_INVALID", message, { path, fix_hint, details, retryable: false }),
  rule,
  severity,
});

const HOUSE = {
  hook_end_ms: 3000,
  max_range_ms_faceless: 4000,
  narration_tolerance_ms: 150,
  min_body_px: 48,
  min_title_px: 72,
  max_words_per_second: 3,
  max_visual_gap_ms: 2500,
  beat_tolerance_frames: 1,
  loop_ssim_threshold: 0.92,
  default_crossfade_ms: 30,
  word_snap_ms: 20,
};

const isFootage = (spec) => Array.isArray(spec.sources) && spec.sources.length > 0;
const wordsIn = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;

export function T1(spec) {
  const out = [];
  const tl = spec.timeline;
  for (let i = 0; i < tl.length; i++) {
    const r = tl[i];
    if (r.end_ms <= r.start_ms) out.push(issue("T1", "error", `Range ${r.id} ends before it starts`, `/timeline/${i}/end_ms`, "Make end_ms greater than start_ms."));
    if (i > 0) {
      const prev = tl[i - 1];
      if (r.start_ms < prev.end_ms) out.push(issue("T1", "error", `Range ${r.id} overlaps ${prev.id}`, `/timeline/${i}/start_ms`, `Set start_ms to ${prev.end_ms} or move ${prev.id}.end_ms earlier.`));
      else if (r.start_ms > prev.end_ms && !r.allow_gap) out.push(issue("T1", "error", `Gap of ${r.start_ms - prev.end_ms} ms before ${r.id}`, `/timeline/${i}/start_ms`, `Set start_ms to ${prev.end_ms} or set allow_gap true.`));
    }
  }
  if (tl[0] && tl[0].start_ms !== 0) out.push(issue("T1", "error", "First range does not start at 0", "/timeline/0/start_ms", "Set the first range start_ms to 0."));
  const last = tl[tl.length - 1];
  if (last && last.end_ms !== spec.format.duration_ms) out.push(issue("T1", "error", `Last range ends at ${last.end_ms} but duration_ms is ${spec.format.duration_ms}`, `/timeline/${tl.length - 1}/end_ms`, `Set format.duration_ms to ${last.end_ms} or extend the last range.`));
  return out;
}

export function T2(spec) {
  const hook = spec.timeline.find((r) => r.beat === "hook");
  if (!hook) return [issue("T2", "warn", "No hook range", "/timeline", "Add a range with beat hook at the start.")];
  if (hook.start_ms !== 0 || hook.end_ms > HOUSE.hook_end_ms) return [issue("T2", "warn", `Hook should start at 0 and end by ${HOUSE.hook_end_ms} ms (proposition in the first 3 s)`, `/timeline/${spec.timeline.indexOf(hook)}`, "Shorten the hook range or move it to the start.")];
  return [];
}

export function T3(spec) {
  if (isFootage(spec) || (spec.meta.format_type && spec.meta.format_type !== "faceless")) return [];
  return spec.timeline.flatMap((r, i) => r.end_ms - r.start_ms > HOUSE.max_range_ms_faceless ? [issue("T3", "warn", `Range ${r.id} is ${r.end_ms - r.start_ms} ms (house max ${HOUSE.max_range_ms_faceless})`, `/timeline/${i}`, "Split the range or add a visual change inside it.")] : []);
}

export function T4(spec, ctx = {}) {
  const wps = ctx.wps ?? 2.5;
  return spec.timeline.flatMap((r, i) => {
    if (!r.narration) return [];
    const est = r.narration_est_ms ?? Math.round((wordsIn(r.narration) / wps) * 1000);
    const len = r.end_ms - r.start_ms;
    if (est > len + HOUSE.narration_tolerance_ms) return [issue("T4", "error", `Narration in ${r.id} needs about ${est} ms but the range is ${len} ms`, `/timeline/${i}/narration`, `Shorten the narration to about ${Math.max(1, Math.floor((len / 1000) * wps))} words or extend the range to ${est} ms.`)];
    return [];
  });
}

function slotRect(layouts, layoutId, slot) {
  const layout = layouts.find((l) => l.id === layoutId);
  return layout?.slots?.[slot] ?? null;
}

function safeInsets(safeZones, preset, w, h) {
  const p = safeZones.presets[preset];
  if (!p) return null;
  if (p.top_pct !== undefined) return { top: p.top_pct, bottom: p.bottom_pct, left: p.left_pct, right: p.right_pct };
  const fw = safeZones.frame.width, fh = safeZones.frame.height;
  return { top: p.top / fh, bottom: p.bottom / fh, left: p.left / fw, right: p.right / fw };
}

function rectInside(rect, ins) {
  const [x, y, w, h] = rect;
  return x >= ins.left && y >= ins.top && x + w <= 1 - ins.right && y + h <= 1 - ins.bottom;
}

export function S1(spec, ctx) {
  const ins = safeInsets(ctx.safeZones, spec.format.safe_zone_preset ?? "universal_strict");
  if (!ins) return [];
  const out = [];
  spec.timeline.forEach((r, i) => {
    r.layers.forEach((l, j) => {
      if (!["text", "counter", "hud", "lower_third", "callout"].includes(l.kind)) return;
      const rect = slotRect(ctx.layouts, r.layout, l.slot);
      if (!rect) { out.push(issue("S1", "error", `Layer ${l.id} uses unknown slot ${l.slot} in layout ${r.layout}`, `/timeline/${i}/layers/${j}/slot`, "Use a slot defined by the layout preset.")); return; }
      if (!rectInside(rect, ins)) out.push(issue("S1", "error", `Text layer ${l.id} slot ${l.slot} is outside the ${spec.format.safe_zone_preset ?? "universal_strict"} safe zone`, `/timeline/${i}/layers/${j}`, "Move the layer to a slot inside the safe zone or choose another layout."));
    });
  });
  return out;
}

export function S2(spec, ctx) {
  const ins = safeInsets(ctx.safeZones, "universal_relaxed");
  if (!ins) return [];
  const out = [];
  spec.timeline.forEach((r, i) => {
    const cap = slotRect(ctx.layouts, r.layout, "caption") ?? slotRect(ctx.layouts, r.layout, "bottom_caption");
    if (!cap) return;
    if (r.caption_state && r.caption_state !== "off" && !rectInside(cap, ins)) out.push(issue("S2", "error", `Caption slot in ${r.id} is outside universal_relaxed`, `/timeline/${i}/layout`, "Pick a layout whose caption slot sits inside the relaxed safe zone."));
    r.layers.forEach((l, j) => {
      if (l.kind !== "text") return;
      const rect = slotRect(ctx.layouts, r.layout, l.slot);
      if (rect && rectsOverlap(rect, cap) && r.caption_state !== "off" && r.caption_state !== "hidden_for_text") out.push(issue("S2", "error", `Captions overlap text layer ${l.id} in ${r.id}`, `/timeline/${i}/caption_state`, "Set caption_state to hidden_for_text while the text layer is visible, or move the text."));
    });
  });
  return out;
}

function rectsOverlap(a, b) {
  return a[0] < b[0] + b[2] && a[0] + a[2] > b[0] && a[1] < b[1] + b[3] && a[1] + a[3] > b[1];
}

export function L1(spec) {
  const out = [];
  spec.timeline.forEach((r, i) => r.layers.forEach((l, j) => {
    if (l.kind !== "text" || !l.font_px) return;
    const role = (r.on_screen_text ?? []).find((t) => t.slot === l.slot)?.role;
    const min = role === "title" ? HOUSE.min_title_px : HOUSE.min_body_px;
    if (l.font_px < min) out.push(issue("L1", "warn", `Text layer ${l.id} is ${l.font_px} px (house minimum ${min} at 1080 width)`, `/timeline/${i}/layers/${j}/font_px`, `Raise font_px to at least ${min}.`));
  }));
  return out;
}

export function L2(spec) {
  return spec.timeline.flatMap((r, i) => {
    const words = (r.on_screen_text ?? []).reduce((n, t) => n + wordsIn(t.text), 0);
    const secs = (r.end_ms - r.start_ms) / 1000;
    if (secs > 0 && words / secs > HOUSE.max_words_per_second) return [issue("L2", "warn", `${words} on-screen words in ${secs.toFixed(1)} s in ${r.id} (house max ${HOUSE.max_words_per_second} words per second)`, `/timeline/${i}/on_screen_text`, "Cut on-screen text or lengthen the range.")];
    return [];
  });
}

export function P1(spec) {
  const out = [];
  for (let i = 0; i < spec.timeline.length; i++) {
    const r = spec.timeline[i];
    const hasMove = r.camera && r.camera.move && r.camera.move !== "static";
    const hasAnim = r.layers.some((l) => (l.animations ?? []).length > 0);
    if (r.end_ms - r.start_ms > HOUSE.max_visual_gap_ms && !hasMove && !hasAnim) out.push(issue("P1", "warn", `No visual change for ${r.end_ms - r.start_ms} ms in ${r.id} (house max ${HOUSE.max_visual_gap_ms})`, `/timeline/${i}`, "Add a camera move, an animation, or split the range."));
  }
  return out;
}

export function A1(spec, ctx) {
  const ledger = { ...(ctx.ledger ?? {}) };
  for (const a of spec.assets ?? []) ledger[a.asset_id] = a;
  const out = [];
  const check = (assetId, path, kind) => {
    const a = ledger[assetId];
    if (!a) return out.push(issue("A1", "error", `Asset ${assetId} is not in the ledger`, path, "Run asset_register for this file or fix the asset_id."));
    if (a.license?.commercial_ok !== true) out.push(issue("A1", "error", `Asset ${assetId} is not cleared for commercial use (license ${a.license?.license_id ?? "unknown"})`, path, "Confirm the license on the source page and set commercial_ok true, or pick another asset."));
    if ((kind === "music" || a.type === "music") && a.license?.content_id_risk === "high") out.push(issue("A1", "error", `Music ${assetId} has high Content ID risk`, path, "Pick a track with content_id_risk none or low (YouTube Audio Library is safest for YouTube)."));
  };
  if (spec.audio?.music?.asset_id) check(spec.audio.music.asset_id, "/audio/music/asset_id", "music");
  if (spec.audio?.voiceover?.asset_id) check(spec.audio.voiceover.asset_id, "/audio/voiceover/asset_id");
  spec.timeline.forEach((r, i) => {
    (r.sfx ?? []).forEach((s, j) => check(s.asset_id, `/timeline/${i}/sfx/${j}/asset_id`));
    r.layers.forEach((l, j) => { if (l.asset_id) check(l.asset_id, `/timeline/${i}/layers/${j}/asset_id`); });
  });
  return out;
}

export function A2(spec, ctx) {
  const m = spec.audio?.music?.asset_id;
  if (!m || !spec.format.platforms.includes("shorts") || spec.format.duration_ms <= 60000) return [];
  const a = (spec.assets ?? []).find((x) => x.asset_id === m) ?? ctx.ledger?.[m];
  const src = (a?.license?.source ?? "").toLowerCase();
  if (src.includes("youtube audio library")) return [];
  return [issue("A2", "warn", "Short over 60 s with music not from the YouTube Audio Library: Content ID claims are possible", "/audio/music", "Use a YouTube Audio Library track or keep the Short at 60 s or less.")];
}

export function B1(spec, ctx) {
  const beats = ctx.beats?.beats_ms;
  if (!beats || beats.length === 0) return [];
  const tol = (1000 / spec.format.fps) * HOUSE.beat_tolerance_frames;
  const out = [];
  spec.timeline.forEach((r, i) => {
    const mode = r.beat_sync?.snap_cuts_to;
    if (!mode || mode === "none") return;
    const grid = mode === "downbeat" || mode === "bar" ? ctx.beats.downbeats_ms ?? beats : beats;
    const nearest = grid.reduce((b, x) => (Math.abs(x - r.start_ms) < Math.abs(b - r.start_ms) ? x : b), grid[0]);
    if (Math.abs(nearest - r.start_ms) > tol) out.push(issue("B1", "warn", `Cut at ${r.start_ms} ms in ${r.id} is ${Math.abs(nearest - r.start_ms).toFixed(0)} ms from the nearest ${mode}`, `/timeline/${i}/start_ms`, `Move the cut to ${nearest} ms (run beat_sync_apply).`));
  });
  return out;
}

export function O1(spec, ctx) {
  if (!spec.format.loop?.enabled) return [];
  const seal = ctx.loopSeal;
  if (!seal) return [issue("O1", "warn", "Loop is enabled but no loop_seal report was provided", "/format/loop", "Run loop_seal and pass its report to the validator.")];
  if (seal.ssim !== undefined && seal.ssim < HOUSE.loop_ssim_threshold) return [issue("O1", "error", `Loop seam SSIM ${seal.ssim} is under ${HOUSE.loop_ssim_threshold}`, "/format/loop", "Patch the last range so its end state matches frame 0 (loop_seal state_match).")];
  if (seal.state_match === false) return [issue("O1", "error", "First and last frame state descriptors do not match", "/format/loop", "Patch the last range so its end state equals frame 0 state.")];
  return [];
}

export function C1(spec) {
  const cta = spec.timeline.find((r) => r.beat === "cta");
  if (!cta) return [issue("C1", "warn", "No CTA range", "/timeline", "Add a short range with beat cta near the end, or skip if intentional.")];
  if (spec.meta.cta_policy !== "early" && cta.start_ms < spec.format.duration_ms / 2) return [issue("C1", "warn", "CTA appears in the first half", `/timeline/${spec.timeline.indexOf(cta)}`, "Move the CTA to the last 25% or set meta.cta_policy to early.")];
  return [];
}

function wordsFor(spec, ctx, sourceId) {
  return ctx.footageIndexes?.[sourceId]?.words ?? [];
}

export function F1(spec, ctx) {
  if (!isFootage(spec)) return [];
  const out = [];
  spec.timeline.forEach((r, i) => {
    if (!r.source_id) return;
    const words = wordsFor(spec, ctx, r.source_id);
    for (const [field, t] of [["source_in_ms", r.source_in_ms], ["source_out_ms", r.source_out_ms]]) {
      if (t === undefined) continue;
      const inside = words.find((w) => t > w.startMs + HOUSE.word_snap_ms && t < w.endMs - HOUSE.word_snap_ms);
      if (inside) out.push(issue("F1", "error", `Cut at ${t} ms in ${r.id} lands inside the word "${inside.text.trim()}"`, `/timeline/${i}/${field}`, `Snap to ${inside.startMs} or ${inside.endMs} ms.`));
    }
  });
  return out;
}

export function F2(spec) {
  if (!isFootage(spec)) return [];
  return spec.timeline.flatMap((r, i) => {
    if (i === 0 || !r.source_id) return [];
    const xf = r.transition_in?.audio_crossfade_ms;
    return xf && xf > 0 ? [] : [issue("F2", "error", `Cut into ${r.id} has no audio crossfade`, `/timeline/${i}/transition_in`, `Set transition_in.audio_crossfade_ms to ${HOUSE.default_crossfade_ms}.`)];
  });
}

function faceBoxes(ctx, sourceId, fromMs, toMs) {
  const idx = ctx.footageIndexes?.[sourceId];
  if (!idx?.faces) return [];
  return idx.faces.flatMap((f) => {
    const sorted = [...f.samples].sort((a, b) => a.t_ms - b.t_ms);
    const before = sorted.filter((s) => s.t_ms <= fromMs).at(-1);
    const inside = sorted.filter((s) => s.t_ms > fromMs && s.t_ms <= toMs);
    return [before, ...inside].filter(Boolean).map((s) => s.bbox_norm);
  });
}

export function F3(spec, ctx) {
  if (!isFootage(spec)) return [];
  const ins = safeInsets(ctx.safeZones, spec.format.safe_zone_preset ?? "universal_strict");
  if (!ins) return [];
  return spec.timeline.flatMap((r, i) => {
    if (!r.source_id || r.source_in_ms === undefined) return [];
    const crop = r.layers.find((l) => l.kind === "face_crop" || l.kind === "source_video")?.props?.crop_norm;
    const boxes = faceBoxes(ctx, r.source_id, r.source_in_ms, r.source_out_ms ?? r.source_in_ms);
    const bad = boxes.find((b) => {
      const box = crop ? mapIntoCrop(b, crop) : b;
      return box && !rectInside(box, ins);
    });
    return bad ? [issue("F3", "error", `A face leaves the safe zone in ${r.id}`, `/timeline/${i}`, "Adjust the crop path (auto_reframe) or reduce the zoom.")] : [];
  });
}

function mapIntoCrop(b, crop) {
  const [cx, cy, cw, ch] = crop;
  if (!cw || !ch) return null;
  return [(b[0] - cx) / cw, (b[1] - cy) / ch, b[2] / cw, b[3] / ch];
}

export function F4(spec, ctx) {
  if (!isFootage(spec)) return [];
  return spec.timeline.flatMap((r, i) => {
    if (!r.source_id || r.caption_state === "off" || r.source_in_ms === undefined) return [];
    const cap = slotRect(ctx.layouts, r.layout, "caption");
    if (!cap) return [];
    const boxes = faceBoxes(ctx, r.source_id, r.source_in_ms, r.source_out_ms ?? r.source_in_ms);
    return boxes.some((b) => rectsOverlap(b, cap)) ? [issue("F4", "error", `Captions cover the face in ${r.id}`, `/timeline/${i}`, "Run caption_apply_style with face_avoid to shift the caption y within universal_relaxed.")] : [];
  });
}

export function F5(spec) {
  if (!isFootage(spec) || !spec.meta.hook_first) return [];
  const hook = spec.timeline.find((r) => r.beat === "hook" && r.start_ms === 0);
  if (!hook || hook.end_ms > HOUSE.hook_end_ms) return [issue("F5", "warn", "hook_first is on but there is no hook range in the first 3 s", "/timeline", "Run hook_first_reorder so the strongest line opens the video.")];
  return [];
}

export const F6 = A1;

export function F7(spec) {
  if (spec.audio?.voiceover?.cloned_or_changed && spec.meta.voice_consent !== true) return [issue("F7", "error", "Cloned or changed voice without a consent flag", "/meta/voice_consent", "Record the speaker's consent and set meta.voice_consent true.")];
  return [];
}

export const RULES = { T1, T2, T3, T4, S1, S2, L1, L2, P1, A1, A2, B1, O1, C1, F1, F2, F3, F4, F5, F7 };
export const HOUSE_HEURISTICS = HOUSE;
