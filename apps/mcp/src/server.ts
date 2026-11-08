import { createMcpHandler, McpServer, ResourceTemplate } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { trackMcp } from "./track.js";
import { content, renderRecipe, searchSkills, skillSummary, skillText, SKILL_CATEGORIES, SKILL_KINDS, SKILL_TAGS } from "./content.js";

export const SERVER_INFO = { name: "scrollsmith", version: "0.2.0" } as const;

export const PUBLIC_HOSTS = ["mcp.scroll-smith.com", "scrollsmith-mcp.vercel.app"];

/** Matches the anonymous install key the website bakes into each visitor's MCP URL. */
export const INSTALL_KEY_RE = /^k_[a-z0-9]{20}$/;

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const json = (v: unknown) => text(JSON.stringify(v, null, 2));
const notFound = (what: string, options: string[]) => text(`${what} not found. Available: ${options.join(", ")}`);

const RESOURCE_INDEX = {
  "skills://{id}": "SKILL.md of one skill",
  "schemas://{id}": "JSON Schema (video_spec.v1, error.v1, footage_index.v1, ...)",
  "decisions://{category}": "Editing decision registry entries for one category",
  "rulebook://{format}": "Format rulebook (faceless, talking_head, ...)",
  "style-packs://{id}": "Style pack manifest",
  "layouts://index": "Layout presets with normalized slot rects",
  "hooks://taxonomy": "Hook types with paraphrased templates and the grading rubric",
  "platforms://presets": "Render presets, safe zones, platform rules, caption presets",
  "asset-sources://{kind}": "Free asset sources with license summaries",
  "recipes://{id}": "Recipe (skill chain) text",
  "toolkit://manifest": "File list of the local toolkit (scripts, schemas, data)",
  "toolkit://{path}": "One toolkit file",
};

export function buildServer(installKey?: string): McpServer {
  const server = new McpServer({
    ...SERVER_INFO,
    title: "Scrollsmith",
    description:
      "Free skills for short-form video: faceless code-driven video, talking-head and branded edits, strategy, hooks, scripts and review. Your own assistant runs everything locally; this server only serves instructions, schemas and scripts.",
    websiteUrl: "https://www.scroll-smith.com",
  });

  const track = (tool: string, extra: Record<string, string | undefined> = {}) =>
    void trackMcp({ event: "tool_call", tool, install_key: installKey, ...extra });

  server.server.oninitialized = () => {
    const client = server.server.getClientVersion();
    void trackMcp({ event: "initialize", install_key: installKey, client_name: client?.name, client_version: client?.version });
  };

  server.registerTool(
    "scrollsmith_status",
    { title: "Scrollsmith status", description: "Confirms the connection works and summarizes what is available: skill counts, categories, resources and how to start.", inputSchema: z.object({}) },
    async () => {
      track("scrollsmith_status");
      const skills = Object.values(content.skills);
      const byKind = Object.fromEntries(SKILL_KINDS.map((k) => [k, skills.filter((s) => s.kind === k).length]));
      return text([
        `Scrollsmith is connected (server ${SERVER_INFO.version}).`,
        `${skills.length} skills (${Object.entries(byKind).map(([k, n]) => `${n} ${k}`).join(", ")}), ${Object.values(content.registry).flat().length} editing decisions, ${Object.keys(content.rulebooks).length} rulebooks, ${Object.keys(content.recipes).length} recipes, ${Object.keys(content.packs).length} style packs.`,
        "Start: call list_skills, or get_recipe recipe_faceless_short / recipe_talking_head_edit. Script skills run on the user's machine via the toolkit (toolkit://manifest); nothing is uploaded and this server never calls a model.",
        "Site: https://www.scroll-smith.com",
      ].join("\n"));
    },
  );

  server.registerTool(
    "list_skills",
    {
      title: "List skills",
      description: "Lists Scrollsmith skills with a one-line description each. Filter by category, tag (faceless, branded, talking_head, universal) or kind (instruction, script, hybrid, resource).",
      inputSchema: z.object({ category: z.enum(SKILL_CATEGORIES).optional(), tag: z.enum(SKILL_TAGS).optional(), kind: z.enum(SKILL_KINDS).optional() }),
    },
    async ({ category, tag, kind }) => {
      track("list_skills");
      const skills = Object.values(content.skills).filter((s) => (!category || s.category === category) && (!tag || s.tag === tag || s.tag === "universal") && (!kind || s.kind === kind));
      return json({ count: skills.length, skills: skills.map(skillSummary), categories: SKILL_CATEGORIES });
    },
  );

  server.registerTool(
    "search_skills",
    { title: "Search skills", description: "Keyword search over skill names, descriptions and instructions. Use when you know the task but not the skill name.", inputSchema: z.object({ query: z.string().min(1), limit: z.number().int().min(1).max(50).optional() }) },
    async ({ query, limit }) => {
      track("search_skills");
      return json({ query, results: searchSkills(query, limit ?? 10) });
    },
  );

  server.registerTool(
    "get_skill",
    { title: "Get skill", description: "Returns the full SKILL.md instructions for one skill plus its file manifest. Read it fully before running the skill.", inputSchema: z.object({ name: z.string() }) },
    async ({ name }) => {
      track("get_skill", { skill: name });
      const s = content.skills[name];
      return s ? text(skillText(s)) : notFound(`Skill ${name}`, Object.keys(content.skills));
    },
  );

  server.registerTool(
    "get_skill_file",
    {
      title: "Get skill file",
      description: "Returns one file by path from a skill folder, or from the toolkit when skill is 'toolkit' (for example path 'node/scene_plan_validate.mjs'). Write it to disk locally before running it.",
      inputSchema: z.object({ skill: z.string(), path: z.string() }),
    },
    async ({ skill, path }) => {
      track("get_skill_file", { skill });
      if (skill === "toolkit") {
        const f = content.toolkit.file_contents[path];
        return f !== undefined ? text(f) : notFound(`Toolkit file ${path}`, content.toolkit.files);
      }
      const s = content.skills[skill];
      if (!s) return notFound(`Skill ${skill}`, Object.keys(content.skills));
      const f = s.file_contents[path];
      return f !== undefined ? text(f) : notFound(`File ${path} in ${skill}`, s.files);
    },
  );

  server.registerTool(
    "get_schema",
    { title: "Get schema", description: "Returns a JSON Schema by id (video_spec.v1, script.v1, error.v1, footage_index.v1, edit_style.v1, brand_kit.v1, edit_decision.v1, style_pack.v1, words.v1, captions.v1, ...). Omit id to list them.", inputSchema: z.object({ id: z.string().optional() }) },
    async ({ id }) => {
      track("get_schema");
      if (!id) return json({ schemas: Object.keys(content.schemas) });
      const s = content.schemas[id];
      return s ? json(s) : notFound(`Schema ${id}`, Object.keys(content.schemas));
    },
  );

  server.registerTool(
    "get_registry",
    { title: "Get editing decisions", description: "Returns editing decision registry entries (edit_decision.v1) for a category, or one entry by id, or the category list. Decisions are data: detector + effect + params; apply them locally with apply_decisions.", inputSchema: z.object({ category: z.string().optional(), id: z.string().optional() }) },
    async ({ category, id }) => {
      track("get_registry");
      const all = Object.values(content.registry).flat();
      if (id) { const d = all.find((x) => x.id === id); return d ? json(d) : notFound(`Decision ${id}`, all.map((x) => x.id)); }
      if (!category) return json({ categories: Object.fromEntries(Object.entries(content.registry).map(([k, v]) => [k, v.length])), total: all.length });
      const list = content.registry[category];
      return list ? json({ category, decisions: list }) : notFound(`Category ${category}`, Object.keys(content.registry));
    },
  );

  server.registerTool(
    "get_rulebook",
    { title: "Get rulebook", description: "Returns a format rulebook (faceless, talking_head, ...) or one section of it (workflow, pacing, framing, captions, audio, brand, export). Omit format to list them.", inputSchema: z.object({ format: z.string().optional(), section: z.string().optional() }) },
    async ({ format, section }) => {
      track("get_rulebook");
      if (!format) return json({ rulebooks: Object.fromEntries(Object.entries(content.rulebooks).map(([k, v]) => [k, Object.keys(v)])) });
      const rb = content.rulebooks[format];
      if (!rb) return notFound(`Rulebook ${format}`, Object.keys(content.rulebooks));
      if (section) return rb[section] !== undefined ? text(rb[section]) : notFound(`Section ${section}`, Object.keys(rb));
      return text(Object.entries(rb).map(([k, v]) => (k === "_intro" ? v : `## ${k}\n${v}`)).join("\n\n"));
    },
  );

  server.registerTool(
    "get_style_pack",
    { title: "Get style pack", description: "Returns a style pack manifest (style_pack.v1) and file list, or one pack file by path, or the pack list. Write the files into a local Remotion project to use the pack.", inputSchema: z.object({ id: z.string().optional(), file: z.string().optional() }) },
    async ({ id, file }) => {
      track("get_style_pack", { skill: id });
      if (!id) return json({ packs: Object.values(content.packs).map((p) => ({ pack_id: p.manifest.pack_id, name: p.manifest.name, version: p.manifest.version, description: p.manifest.description, status: p.manifest.status })) });
      const p = content.packs[id];
      if (!p) return notFound(`Style pack ${id}`, Object.keys(content.packs));
      if (file) { const f = p.file_contents[file]; return f !== undefined ? text(f) : notFound(`File ${file}`, p.files); }
      return json({ manifest: p.manifest, files: p.files });
    },
  );

  server.registerTool(
    "get_asset_sources",
    { title: "Get free asset sources", description: "Where to get free music, sfx, video, images, fonts, green screens and gifs, with license summaries and last_verified dates. The server never downloads assets; the user downloads into their own library.", inputSchema: z.object({ kind: z.string().optional() }) },
    async ({ kind }) => {
      track("get_asset_sources");
      if (!kind) return json({ kinds: Object.keys(content.asset_sources), rules: ["Free to download is not safe to monetize: show the license summary and ask the user to confirm on the source page.", "Music can still get a Content ID claim on YouTube; the YouTube Audio Library is the safest choice there.", "Record the license per file with asset_register; unknown license blocks the final render."] });
      const s = content.asset_sources[kind];
      return s ? json(s) : notFound(`Asset kind ${kind}`, Object.keys(content.asset_sources));
    },
  );

  server.registerTool(
    "get_recipe",
    { title: "Get recipe", description: "Returns a recipe: an ordered skill chain with checkpoints (recipe_faceless_short, recipe_talking_head_edit, ...). Omit id to list recipes.", inputSchema: z.object({ id: z.string().optional() }) },
    async ({ id }) => {
      track("get_recipe", { skill: id });
      if (!id) return json({ recipes: Object.values(content.recipes).map((r) => ({ name: r.name, title: r.title, description: r.description, args: r.args ?? {} })) });
      const r = content.recipes[id];
      return r ? text(`# ${r.title}\n${r.description}\n\n${r.body}`) : notFound(`Recipe ${id}`, Object.keys(content.recipes));
    },
  );

  registerResources(server);
  registerPrompts(server);
  return server;
}

function registerResources(server: McpServer) {
  const textRes = (uri: string, t: string, mimeType = "text/markdown") => ({ contents: [{ uri, mimeType, text: t }] });
  const jsonRes = (uri: string, v: unknown) => textRes(uri, JSON.stringify(v, null, 2), "application/json");
  const listOf = (scheme: string, ids: string[], name: (id: string) => string) => ({ resources: ids.map((id) => ({ uri: `${scheme}://${id}`, name: name(id) })) });

  server.registerResource("skills", new ResourceTemplate("skills://{id}", { list: () => listOf("skills", Object.keys(content.skills), (id) => content.skills[id].description) }), { description: RESOURCE_INDEX["skills://{id}"] }, async (uri, { id }) => {
    const s = content.skills[String(id)];
    if (!s) throw new Error(`Unknown skill ${id}`);
    return textRes(uri.href, skillText(s));
  });
  server.registerResource("schemas", new ResourceTemplate("schemas://{id}", { list: () => listOf("schemas", Object.keys(content.schemas), (id) => id) }), { description: RESOURCE_INDEX["schemas://{id}"] }, async (uri, { id }) => jsonRes(uri.href, content.schemas[String(id)] ?? { error: `Unknown schema ${id}` }));
  server.registerResource("decisions", new ResourceTemplate("decisions://{category}", { list: () => listOf("decisions", Object.keys(content.registry), (id) => `${id} (${content.registry[id].length})`) }), { description: RESOURCE_INDEX["decisions://{category}"] }, async (uri, { category }) => jsonRes(uri.href, content.registry[String(category)] ?? { error: `Unknown category ${category}` }));
  server.registerResource("rulebook", new ResourceTemplate("rulebook://{format}", { list: () => listOf("rulebook", Object.keys(content.rulebooks), (id) => `${id} rulebook`) }), { description: RESOURCE_INDEX["rulebook://{format}"] }, async (uri, { format }) => {
    const rb = content.rulebooks[String(format)];
    return textRes(uri.href, rb ? Object.entries(rb).map(([k, v]) => (k === "_intro" ? v : `## ${k}\n${v}`)).join("\n\n") : `Unknown rulebook ${format}`);
  });
  server.registerResource("style-packs", new ResourceTemplate("style-packs://{id}", { list: () => listOf("style-packs", Object.keys(content.packs), (id) => content.packs[id].manifest.name ?? id) }), { description: RESOURCE_INDEX["style-packs://{id}"] }, async (uri, { id }) => jsonRes(uri.href, content.packs[String(id)]?.manifest ?? { error: `Unknown pack ${id}` }));
  server.registerResource("layouts", "layouts://index", { description: RESOURCE_INDEX["layouts://index"], mimeType: "application/json" }, async (uri) => jsonRes(uri.href, content.data.layouts));
  server.registerResource("hooks", "hooks://taxonomy", { description: RESOURCE_INDEX["hooks://taxonomy"], mimeType: "application/json" }, async (uri) => jsonRes(uri.href, content.data["hooks-taxonomy"]));
  server.registerResource("platforms", "platforms://presets", { description: RESOURCE_INDEX["platforms://presets"], mimeType: "application/json" }, async (uri) =>
    jsonRes(uri.href, { render_presets: content.data["render-presets"], safe_zones: content.data["safe-zones"], platform_rules: content.data["platform-rules"], caption_presets: content.data["caption-presets"], motion_primitives: content.data["motion-primitives"], voices: content.data.voices }),
  );
  server.registerResource("asset-sources", new ResourceTemplate("asset-sources://{kind}", { list: () => listOf("asset-sources", Object.keys(content.asset_sources), (id) => `free ${id} sources`) }), { description: RESOURCE_INDEX["asset-sources://{kind}"] }, async (uri, { kind }) => jsonRes(uri.href, content.asset_sources[String(kind)] ?? { error: `Unknown kind ${kind}` }));
  server.registerResource("recipes", new ResourceTemplate("recipes://{id}", { list: () => listOf("recipes", Object.keys(content.recipes), (id) => content.recipes[id].title) }), { description: RESOURCE_INDEX["recipes://{id}"] }, async (uri, { id }) => {
    const r = content.recipes[String(id)];
    return textRes(uri.href, r ? `# ${r.title}\n${r.description}\n\n${r.body}` : `Unknown recipe ${id}`);
  });
  server.registerResource("toolkit-manifest", "toolkit://manifest", { description: RESOURCE_INDEX["toolkit://manifest"], mimeType: "application/json" }, async (uri) =>
    jsonRes(uri.href, { install: "Write every file under ./toolkit/ keeping paths, then run: cd toolkit && npm install. Python extras: pip install -r requirements.txt in a venv.", files: content.toolkit.files }),
  );
  server.registerResource("toolkit", new ResourceTemplate("toolkit://{+path}", { list: undefined }), { description: RESOURCE_INDEX["toolkit://{path}"] }, async (uri, { path }) => {
    const f = content.toolkit.file_contents[String(path)];
    return textRes(uri.href, f ?? `Unknown toolkit file ${path}`, "text/plain");
  });
}

function registerPrompts(server: McpServer) {
  for (const r of Object.values(content.recipes)) {
    const shape = Object.fromEntries(Object.entries(r.args ?? {}).map(([k, desc]) => [k, z.string().optional().describe(desc)]));
    server.registerPrompt(r.name, { title: r.title, description: r.description, argsSchema: z.object(shape) }, async (args) => ({
      description: r.description,
      messages: [{ role: "user" as const, content: { type: "text" as const, text: `Use the Scrollsmith MCP. Recipe ${r.name}:\n\n${renderRecipe(r, args as Record<string, string | undefined>)}\n\nFor each step call get_skill first and follow its SKILL.md. Script skills need the local toolkit (toolkit://manifest).` } }],
    }));
  }
}

/** Stateless: a handler per request, so the install key from the URL can be attached to every event it logs. */
export function createHandler(installKey?: string) {
  return createMcpHandler(() => buildServer(installKey));
}

/** Install key from `/mcp/<key>` (dev server, direct hits) or `?key=` (Vercel rewrite); undefined when absent or malformed. */
export function installKeyFromUrl(url: string | URL): string | undefined {
  const u = typeof url === "string" ? new URL(url, "http://localhost") : url;
  const key = u.searchParams.get("key") ?? u.pathname.match(/^\/(?:api\/)?mcp\/([^/]+)\/?$/)?.[1];
  return key && INSTALL_KEY_RE.test(key) ? key : undefined;
}
