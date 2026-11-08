#!/usr/bin/env node
/**
 * duration_estimate: words to milliseconds per voice.
 * Input: { text?, script_path?, voice_id?, speed?, project_path? }
 * Output: { est_ms, wps_used, spoken_words, per_line? }
 * Also exports updateWps(project_path, voice_id, measured_wps) used after tts_generate (EMA, alpha 0.3).
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { readJson, writeJson, run } from "./lib/io.mjs";
import { loadData } from "./lib/validate.mjs";

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const SCALES = [["billion", 1e9], ["million", 1e6], ["thousand", 1e3]];

/** Integer to English words (spoken form), used for duration counting only. */
export function numberToWords(n) {
  if (n === 0) return "zero";
  if (n < 0) return `minus ${numberToWords(-n)}`;
  const parts = [];
  for (const [name, v] of SCALES) if (n >= v) { parts.push(`${numberToWords(Math.floor(n / v))} ${name}`); n %= v; }
  if (n >= 100) { parts.push(`${ONES[Math.floor(n / 100)]} hundred`); n %= 100; }
  if (n >= 20) parts.push(TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : ""));
  else if (n > 0) parts.push(ONES[n]);
  return parts.join(" ");
}

/** Expand digits, percents, currency and decimals to their spoken form. */
export function expandNumbers(text) {
  return text
    .replace(/\$(\d[\d,]*)(\.\d+)?/g, (_, i, d) => `${numberToWords(Number(i.replace(/,/g, "")))} dollars${d ? ` and ${numberToWords(Number(d.slice(1)))} cents` : ""}`)
    .replace(/(\d[\d,]*)%/g, (_, i) => `${numberToWords(Number(i.replace(/,/g, "")))} percent`)
    .replace(/(\d[\d,]*)\.(\d+)/g, (_, i, d) => `${numberToWords(Number(i.replace(/,/g, "")))} point ${[...d].map((c) => numberToWords(Number(c))).join(" ")}`)
    .replace(/\d[\d,]*/g, (m) => numberToWords(Number(m.replace(/,/g, ""))));
}

export function spokenWordCount(text) {
  return expandNumbers(text).replace(/[^\p{L}\p{N}'\s-]/gu, " ").trim().split(/\s+/).filter(Boolean).length;
}

/** Pause budget from punctuation: 0 to 120 ms per mark. */
export function pauseMs(text) {
  const commas = (text.match(/[,;:]/g) ?? []).length;
  const stops = (text.match(/[.!?]/g) ?? []).length;
  const breaks = (text.match(/<break[^>]*\/>/g) ?? []).length;
  return commas * 60 + stops * 120 + breaks * 250;
}

export function wpsFor(voiceId, projectPath) {
  const calib = projectPath ? join(projectPath, "voices.calibration.json") : null;
  if (calib && existsSync(calib)) { const c = readJson(calib); if (c[voiceId]) return c[voiceId].wps; }
  const voices = loadData("voices");
  return voices.voices.find((v) => v.voice_id === voiceId)?.wps ?? voices.default_wps;
}

export function estimate(text, { voice_id = "local_default", speed = 1, project_path } = {}) {
  const wps = wpsFor(voice_id, project_path) * speed;
  const words = spokenWordCount(text);
  return { est_ms: Math.round((words / wps) * 1000 + pauseMs(text)), wps_used: wps, spoken_words: words };
}

/** Update the per-voice words-per-second calibration with an exponential moving average. */
export function updateWps(projectPath, voiceId, measuredWps, alpha = 0.3) {
  const p = join(projectPath, "voices.calibration.json");
  const c = existsSync(p) ? readJson(p) : {};
  const prev = c[voiceId]?.wps ?? wpsFor(voiceId);
  c[voiceId] = { wps: Math.round((prev * (1 - alpha) + measuredWps * alpha) * 1000) / 1000, samples: (c[voiceId]?.samples ?? 0) + 1 };
  writeJson(p, c);
  return c[voiceId];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run((input) => {
    if (input.script_path) {
      const script = readJson(input.script_path);
      const per_line = script.lines.map((l) => ({ line_id: l.id, ...estimate(l.text, input) }));
      return { est_ms: per_line.reduce((s, l) => s + l.est_ms, 0), wps_used: per_line[0]?.wps_used ?? null, spoken_words: per_line.reduce((s, l) => s + l.spoken_words, 0), per_line };
    }
    if (typeof input.text !== "string") throw new Error("Provide text or script_path");
    return estimate(input.text, input);
  });
}
