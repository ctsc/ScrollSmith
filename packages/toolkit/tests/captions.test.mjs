import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCaptions, toSrt, toVtt, approxTextWidthPx } from "../node/captions_build.mjs";
import { checkEnv } from "../node/local_env_check.mjs";
import { validateAgainst } from "../node/lib/validate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const words = () => JSON.parse(readFileSync(join(here, "fixtures", "words.sample.json"), "utf8")).words;

test("pages respect max words and mark numbers", () => {
  const c = buildCaptions(words(), { preset: "cube_pop_3word", max_words_per_page: 3, emphasis: "numbers" });
  assert.equal(validateAgainst("captions.v1", c).length, 0);
  assert.ok(c.pages.every((p) => p.tokens.length <= 3));
  const flat = c.pages.flatMap((p) => p.tokens);
  assert.equal(flat.find((t) => t.text.trim() === "32").emphasis, true);
  assert.equal(flat.find((t) => t.text.trim() === "coins").emphasis, false);
  assert.equal(c.pages[0].startMs, 0);
});

test("narrow slot splits wide pages", () => {
  const c = buildCaptions(words(), { preset: "single_word_slam", max_words_per_page: 3, slot_width_px: 200 });
  assert.ok(c.pages.every((p) => p.tokens.length === 1 || !p.overflow));
  assert.ok(approxTextWidthPx("Double", 96) > 200);
});

test("unknown preset is a tool error", () => {
  assert.throws(() => buildCaptions(words(), { preset: "nope" }), (e) => e.code === "INVALID_INPUT" && /Use one of/.test(e.fix_hint));
});

test("srt and vtt serialize", () => {
  const c = buildCaptions(words(), { preset: "pop_in_3word" });
  assert.match(toSrt(c.pages), /00:00:00,000 --> /);
  assert.match(toVtt(c.pages), /^WEBVTT/);
});

test("local_env_check reports node and ffmpeg", () => {
  const r = checkEnv({ probe_python: false, probe_optional: false });
  assert.ok(r.found.node.startsWith("v"));
  assert.ok(Array.isArray(r.missing));
  assert.ok(r.notes.some((n) => /Remotion license/.test(n)));
});
