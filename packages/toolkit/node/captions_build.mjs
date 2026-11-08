#!/usr/bin/env node
/**
 * captions_build: pages and styling from word timings.
 * Input: { words_path, preset, max_words_per_page?, emphasis?: none|keywords|numbers|keywords_and_numbers, emphasis_words?: [], combine_tokens_within_ms?: 1200, slot_width_px?: 800, out_dir? }
 * Output: { captions_path, srt_path, vtt_path, pages, overflow_pages[] }
 * Uses @remotion/captions createTikTokStyleCaptions, then post-splits pages to max_words_per_page and
 * re-splits pages wider than the slot (approximate text measure: 0.55 em per character).
 */
import { join, dirname, basename } from "node:path";
import { createTikTokStyleCaptions, serializeSrt } from "@remotion/captions";
import { readJson, writeJson, run, toolError } from "./lib/io.mjs";
import { loadData } from "./lib/validate.mjs";
import { writeFileSync } from "node:fs";

const NUMBER_RE = /\d|\b(one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million|billion|percent)\b/i;

export function approxTextWidthPx(text, fontPx) {
  return text.trim().length * fontPx * 0.55;
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export function buildCaptions(words, opts = {}) {
  const presets = loadData("caption-presets").presets;
  const preset = presets[opts.preset ?? "pop_in_3word"];
  if (!preset) throw toolError("INVALID_INPUT", `Unknown caption preset ${opts.preset}`, { fix_hint: `Use one of: ${Object.keys(presets).join(", ")}.` });
  const maxWords = opts.max_words_per_page ?? preset.words_per_page ?? 3;
  const emphasis = opts.emphasis ?? "none";
  const keywords = new Set((opts.emphasis_words ?? []).map((w) => w.toLowerCase()));
  const slotWidth = opts.slot_width_px ?? 800;
  const captions = words.map((w) => ({ text: w.text.startsWith(" ") ? w.text : ` ${w.text}`, startMs: w.startMs, endMs: w.endMs, timestampMs: w.timestampMs ?? null, confidence: w.confidence ?? null }));
  const { pages } = createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: opts.combine_tokens_within_ms ?? 1200 });

  const isEmph = (t) => {
    const clean = t.trim().toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
    const byNum = (emphasis === "numbers" || emphasis === "keywords_and_numbers") && NUMBER_RE.test(t);
    const byKey = (emphasis === "keywords" || emphasis === "keywords_and_numbers") && keywords.has(clean);
    return Boolean(byNum || byKey);
  };

  const queue = pages.flatMap((p) => chunk(p.tokens, maxWords));
  const result = [];
  while (queue.length) {
    let tokens = queue.shift();
    if (tokens.length > 1 && approxTextWidthPx(tokens.map((t) => t.text).join(""), preset.size_px) > slotWidth) {
      const half = Math.ceil(tokens.length / 2);
      queue.unshift(tokens.slice(half));
      tokens = tokens.slice(0, half);
      queue.unshift(tokens);
      continue;
    }
    const text = tokens.map((t) => t.text).join("").trim();
    result.push({
      startMs: tokens[0].fromMs,
      endMs: tokens[tokens.length - 1].toMs,
      text,
      overflow: approxTextWidthPx(text, preset.size_px) > slotWidth,
      tokens: tokens.map((t) => ({ text: t.text, fromMs: t.fromMs, toMs: t.toMs, emphasis: isEmph(t.text) })),
    });
  }
  return { preset: opts.preset ?? "pop_in_3word", max_words_per_page: maxWords, pages: result };
}

export function toVtt(pages) {
  const ts = (ms) => new Date(ms).toISOString().slice(11, 23);
  return `WEBVTT\n\n${pages.map((p, i) => `${i + 1}\n${ts(p.startMs)} --> ${ts(p.endMs)}\n${p.text}\n`).join("\n")}`;
}

export function toSrt(pages) {
  return serializeSrt({ lines: pages.map((p) => [{ text: p.text, startMs: p.startMs, endMs: p.endMs, timestampMs: null, confidence: null }]) });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    if (!input.words_path) throw toolError("INVALID_INPUT", "words_path is required");
    const words = readJson(input.words_path).words;
    const caps = buildCaptions(words, input);
    const dir = input.out_dir ?? dirname(input.words_path);
    const stem = basename(input.words_path).replace(/\.words\.json$|\.json$/, "");
    const paths = { captions_path: join(dir, `${stem}.captions.json`), srt_path: join(dir, `${stem}.srt`), vtt_path: join(dir, `${stem}.vtt`) };
    writeJson(paths.captions_path, caps);
    writeFileSync(paths.srt_path, toSrt(caps.pages));
    writeFileSync(paths.vtt_path, toVtt(caps.pages));
    return { ...paths, pages: caps.pages.length, overflow_pages: caps.pages.filter((p) => p.overflow).map((p) => p.text) };
  });
}
