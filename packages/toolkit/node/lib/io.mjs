import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createHash } from "node:crypto";

/**
 * Shared I/O for toolkit scripts.
 * Convention: scripts take a JSON input (file path argument or stdin), print JSON to stdout,
 * print error.v1 on failure. Exit codes: 0 ok, 1 invalid input, 2 environment missing, 3 runtime failure.
 */

export const EXIT = { OK: 0, INVALID_INPUT: 1, ENV_MISSING: 2, RUNTIME: 3 };

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
}

export function readInput(argv = process.argv.slice(2)) {
  const file = argv.find((a) => !a.startsWith("--"));
  if (file) return readJson(file);
  const raw = readFileSync(0, "utf8").trim();
  return raw ? JSON.parse(raw) : {};
}

export function flag(name, argv = process.argv.slice(2)) {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return undefined;
  const v = argv[i + 1];
  return v === undefined || v.startsWith("--") ? true : v;
}

export function out(value) {
  process.stdout.write(JSON.stringify(value, null, 2) + "\n");
}

/** Build an error.v1 object. */
export function toolError(code, message, extra = {}) {
  const retryable = extra.retryable ?? ["RATE_LIMITED", "TIMEOUT", "PROVIDER_ERROR"].includes(code);
  const e = { code, message, retryable };
  for (const k of ["path", "fix_hint", "details"]) if (extra[k] !== undefined) e[k] = extra[k];
  return e;
}

function exitCodeFor(code) {
  if (code === "INVALID_INPUT" || code === "SPEC_INVALID") return EXIT.INVALID_INPUT;
  if (code === "ENV_MISSING") return EXIT.ENV_MISSING;
  return EXIT.RUNTIME;
}

/** Print error.v1 and exit with the matching code. */
export function fail(code, message, extra = {}) {
  out(toolError(code, message, extra));
  process.exit(exitCodeFor(code));
}

export function sha256(data) {
  return createHash("sha256").update(typeof data === "string" || Buffer.isBuffer(data) ? data : JSON.stringify(data)).digest("hex");
}

/** Stable JSON (sorted keys) so hashes do not depend on key order. */
export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function hashValue(value) {
  return sha256(stableStringify(value));
}

/** Run a script main() with uniform error handling. */
export async function run(main) {
  try {
    const result = await main(readInput());
    if (result !== undefined) out(result);
  } catch (err) {
    if (err && err.code && err.message && typeof err.retryable === "boolean") {
      out(err);
      process.exit(exitCodeFor(err.code));
    }
    fail("INVALID_INPUT", err instanceof Error ? err.message : String(err));
  }
}
