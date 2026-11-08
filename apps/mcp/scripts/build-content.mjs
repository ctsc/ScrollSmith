#!/usr/bin/env node
/**
 * Builds apps/mcp/content/bundle.json from the repo's skill content so the Vercel function can import it
 * statically (the function cannot read files outside apps/mcp at runtime).
 * Sources: skills/<id>/, packages/toolkit/{schemas,data,registry,node,python,requirements.txt,package.json,README.md},
 * rulebooks/<format>.md, recipes/<id>.md, packages/packs/<id>/manifest.json (+ files).
 * Run: pnpm --filter @scrollsmith/mcp content:build   Check freshness: content:check
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, "..", "..", "..");
const OUT = join(here, "..", "content", "bundle.json");
const TEXT_EXT = new Set([".md", ".json", ".mjs", ".js", ".ts", ".tsx", ".py", ".txt", ".yaml", ".yml", ".sh", ".css", ".html", ".srt", ".vtt"]);

function walk(dir, skip = (p) => false) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (skip(p)) continue;
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p, skip));
    else out.push(p);
  }
  return out;
}

function textFiles(dir, skip) {
  const files = {};
  for (const p of walk(dir, skip)) {
    const ext = p.slice(p.lastIndexOf("."));
    if (!TEXT_EXT.has(ext)) continue;
    files[relative(dir, p).split("\\").join("/")] = readFileSync(p, "utf8");
  }
  return files;
}

function frontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error("SKILL.md is missing frontmatter");
  return { meta: parseYaml(m[1]), body: m[2].trim() };
}

function sections(md) {
  const out = {};
  let current = "_intro";
  for (const line of md.split("\n")) {
    const h = line.match(/^## (.+)$/);
    if (h) { current = h[1].trim(); out[current] = ""; continue; }
    out[current] = (out[current] ?? "") + line + "\n";
  }
  for (const k of Object.keys(out)) out[k] = out[k].trim();
  return out;
}

const REQUIRED = ["name", "description", "kind", "tag", "category"];
const KINDS = new Set(["instruction", "script", "hybrid", "resource"]);
const TAGS = new Set(["faceless", "branded", "talking_head", "universal"]);
const CATEGORIES = new Set(["strategy", "script", "scene", "design", "motion", "audio", "captions", "footage", "image", "assets", "render", "quality", "workflow", "orchestration"]);

export function build() {
  const skills = {};
  const skillsDir = join(ROOT, "skills");
  for (const id of readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory()).sort()) {
    const dir = join(skillsDir, id);
    const md = readFileSync(join(dir, "SKILL.md"), "utf8");
    const { meta, body } = frontmatter(md);
    for (const k of REQUIRED) if (!meta[k]) throw new Error(`skills/${id}: frontmatter missing ${k}`);
    if (meta.name !== id) throw new Error(`skills/${id}: frontmatter name "${meta.name}" must equal the folder name`);
    if (!KINDS.has(meta.kind)) throw new Error(`skills/${id}: kind must be one of ${[...KINDS].join(", ")}`);
    if (!TAGS.has(meta.tag)) throw new Error(`skills/${id}: tag must be one of ${[...TAGS].join(", ")}`);
    if (!CATEGORIES.has(meta.category)) throw new Error(`skills/${id}: category must be one of ${[...CATEGORIES].join(", ")}`);
    if (/\u2014/.test(md)) throw new Error(`skills/${id}: contains an em dash`);
    const files = textFiles(dir);
    delete files["SKILL.md"];
    skills[id] = { ...meta, body, files: Object.keys(files).sort(), file_contents: files };
  }

  const tk = join(ROOT, "packages", "toolkit");
  const schemas = {};
  for (const f of readdirSync(join(tk, "schemas")).filter((f) => f.endsWith(".json")).sort()) schemas[f.replace(/\.json$/, "")] = JSON.parse(readFileSync(join(tk, "schemas", f), "utf8"));
  const data = {};
  for (const f of readdirSync(join(tk, "data")).filter((f) => f.endsWith(".json")).sort()) data[f.replace(/\.json$/, "")] = JSON.parse(readFileSync(join(tk, "data", f), "utf8"));
  const assetSources = {};
  const asDir = join(tk, "data", "asset-sources");
  if (existsSync(asDir)) for (const f of readdirSync(asDir).filter((f) => f.endsWith(".json")).sort()) assetSources[f.replace(/\.json$/, "")] = JSON.parse(readFileSync(join(asDir, f), "utf8"));
  const registry = {};
  for (const f of readdirSync(join(tk, "registry")).filter((f) => f.endsWith(".json")).sort()) registry[f.replace(/\.json$/, "")] = JSON.parse(readFileSync(join(tk, "registry", f), "utf8")).decisions;
  const toolkitFiles = textFiles(tk, (p) => /node_modules|\/tests\//.test(p) || basename(p) === "bundle.json");

  const rulebooks = {};
  const rbDir = join(ROOT, "rulebooks");
  for (const f of readdirSync(rbDir).filter((f) => f.endsWith(".md")).sort()) rulebooks[f.replace(/\.md$/, "")] = sections(readFileSync(join(rbDir, f), "utf8"));

  const recipes = {};
  const rcDir = join(ROOT, "recipes");
  for (const f of readdirSync(rcDir).filter((f) => f.endsWith(".md")).sort()) {
    const { meta, body } = frontmatter(readFileSync(join(rcDir, f), "utf8"));
    recipes[f.replace(/\.md$/, "")] = { ...meta, body };
  }

  const packs = {};
  const packsDir = join(ROOT, "packages", "packs");
  if (existsSync(packsDir)) for (const id of readdirSync(packsDir).filter((d) => statSync(join(packsDir, d)).isDirectory()).sort()) {
    const dir = join(packsDir, id);
    const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
    const files = textFiles(dir, (p) => /node_modules|dist/.test(p));
    delete files["manifest.json"];
    packs[id] = { manifest, files: Object.keys(files).sort(), file_contents: files };
  }

  return { version: 1, skills, schemas, data, asset_sources: assetSources, registry, rulebooks, recipes, packs, toolkit: { files: Object.keys(toolkitFiles).sort(), file_contents: toolkitFiles } };
}

const bundle = build();
const json = JSON.stringify(bundle);
if (process.argv.includes("--check")) {
  const current = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (current !== json) { console.error("content/bundle.json is stale: run pnpm --filter @scrollsmith/mcp content:build"); process.exit(1); }
  console.log("content bundle is fresh");
} else {
  writeFileSync(OUT, json);
  console.log(`wrote ${OUT} (${(json.length / 1024).toFixed(0)} KB): ${Object.keys(bundle.skills).length} skills, ${Object.keys(bundle.schemas).length} schemas, ${Object.values(bundle.registry).flat().length} decisions, ${Object.keys(bundle.rulebooks).length} rulebooks, ${Object.keys(bundle.recipes).length} recipes, ${Object.keys(bundle.packs).length} packs`);
}
