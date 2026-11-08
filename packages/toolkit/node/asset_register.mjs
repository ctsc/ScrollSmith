#!/usr/bin/env node
/**
 * asset_register: add an asset to the local license ledger (assets/ledger.json), sha256 dedupe.
 * Input: { project_path, path, type, source?, license_id?, attribution?, commercial_ok?, content_id_risk?, ai_generated?, asset_id? }
 * Output: asset_ref (video_spec.v1 $defs/asset_ref) plus { ledger_path, deduped }
 * Unknown license (license_id unknown or commercial_ok not true) is allowed here but blocks final render (rule A1).
 */
import { existsSync, readFileSync } from "node:fs";
import { join, basename, extname } from "node:path";
import { readJson, writeJson, run, sha256, toolError } from "./lib/io.mjs";

const TYPE_BY_EXT = { ".mp3": "music", ".wav": "audio", ".m4a": "audio", ".ogg": "audio", ".flac": "audio", ".png": "image", ".jpg": "image", ".jpeg": "image", ".webp": "image", ".gif": "gif", ".mp4": "video", ".mov": "video", ".webm": "video", ".ttf": "font", ".otf": "font", ".woff2": "font", ".json": "lottie", ".glb": "model3d", ".gltf": "model3d" };

export function registerAsset(input) {
  if (!input.project_path || !input.path) throw toolError("INVALID_INPUT", "project_path and path are required");
  const abs = input.path.startsWith("/") || /^[A-Za-z]:/.test(input.path) ? input.path : join(input.project_path, input.path);
  if (!existsSync(abs)) throw toolError("ASSET_NOT_FOUND", `File not found: ${abs}`, { fix_hint: "Check the path; it is relative to the project folder unless absolute." });
  const hash = sha256(readFileSync(abs));
  const ledgerPath = join(input.project_path, "assets", "ledger.json");
  const ledger = existsSync(ledgerPath) ? readJson(ledgerPath) : { assets: [] };
  const existing = ledger.assets.find((a) => a.sha256 === hash);
  if (existing && !input.asset_id) return { ...existing, ledger_path: ledgerPath, deduped: true };
  const type = input.type ?? TYPE_BY_EXT[extname(abs).toLowerCase()];
  if (!type) throw toolError("INVALID_INPUT", "Could not infer asset type; pass type", { fix_hint: "type is one of audio, music, sfx, image, video, font, model3d, lottie, gif." });
  const ref = {
    asset_id: input.asset_id ?? `${type}_${basename(abs).replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${hash.slice(0, 6)}`,
    type,
    path: input.path,
    sha256: hash,
    license: {
      source: input.source ?? "unknown",
      license_id: input.license_id ?? "unknown",
      attribution: input.attribution ?? "",
      commercial_ok: input.commercial_ok === true,
      content_id_risk: input.content_id_risk ?? (type === "music" ? "unknown" : "none"),
    },
    ai_generated: input.ai_generated === true,
  };
  ledger.assets = ledger.assets.filter((a) => a.asset_id !== ref.asset_id);
  ledger.assets.push(ref);
  writeJson(ledgerPath, ledger);
  return { ...ref, ledger_path: ledgerPath, deduped: false };
}

if (import.meta.url === `file://${process.argv[1]}`) run(registerAsset);
