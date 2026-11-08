#!/usr/bin/env node
/**
 * project_create: create the local project folder (spec section 3.6) with defaults.
 * Input: { path, name, platforms?: [], aspect?: "9:16", fps?: 30, style_pack_id?, brand_kit? }
 * Output: { project_path, created[] }
 */
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { writeJson, run, toolError } from "./lib/io.mjs";

const DIRS = ["series", "specs", "footage", "assets", "history", "renders", "runs", "scripts", "captions", "audio"];

export function createProject(input) {
  if (!input.path || !input.name) throw toolError("INVALID_INPUT", "path and name are required");
  const root = input.path;
  const created = [];
  for (const d of DIRS) { const p = join(root, d); if (!existsSync(p)) { mkdirSync(p, { recursive: true }); created.push(p); } }
  const project = {
    project_id: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name: input.name,
    platforms: input.platforms ?? ["tiktok", "reels", "shorts"],
    defaults: { aspect: input.aspect ?? "9:16", fps: input.fps ?? 30, style_pack_id: input.style_pack_id ?? null, safe_zone_preset: "universal_strict", language: input.language ?? "en" },
    local_only: true,
    created_at: new Date().toISOString(),
  };
  const files = { "project.json": project, "assets/library.json": { indexed_at: null, folders: [], items: [] }, "assets/ledger.json": { assets: [] }, "history/episodes.json": { episodes: [] } };
  if (input.brand_kit) files["brand_kit.json"] = input.brand_kit;
  for (const [rel, value] of Object.entries(files)) { const p = join(root, rel); if (!existsSync(p)) { writeJson(p, value); created.push(p); } }
  return { project_path: root, project_id: project.project_id, created };
}

if (import.meta.url === `file://${process.argv[1]}`) run(createProject);
