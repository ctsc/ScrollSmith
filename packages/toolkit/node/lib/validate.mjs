import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { toolError } from "./io.mjs";

const here = dirname(fileURLToPath(import.meta.url));
export const SCHEMA_DIR = join(here, "..", "..", "schemas");
export const DATA_DIR = join(here, "..", "..", "data");

let ajv;

/** One Ajv instance with every schema in schemas/ registered by $id. */
export function getAjv() {
  if (ajv) return ajv;
  ajv = new Ajv2020({ allErrors: true, strict: false, allowUnionTypes: true });
  addFormats(ajv);
  for (const f of readdirSync(SCHEMA_DIR).filter((f) => f.endsWith(".json"))) {
    ajv.addSchema(JSON.parse(readFileSync(join(SCHEMA_DIR, f), "utf8")));
  }
  return ajv;
}

export function listSchemaIds() {
  return readdirSync(SCHEMA_DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
}

export function loadData(name) {
  return JSON.parse(readFileSync(join(DATA_DIR, `${name}.json`), "utf8"));
}

/** Validate a value against a schema id; returns error.v1[] (empty when valid). */
export function validateAgainst(schemaId, value) {
  const validate = getAjv().getSchema(schemaId);
  if (!validate) throw new Error(`Unknown schema: ${schemaId}`);
  if (validate(value)) return [];
  return (validate.errors ?? []).map((e) =>
    toolError("SPEC_INVALID", `${e.instancePath || "/"} ${e.message ?? "invalid"}`, {
      path: e.instancePath || "/",
      fix_hint: hintFor(e),
      details: e.params,
      retryable: false,
    }),
  );
}

function hintFor(e) {
  switch (e.keyword) {
    case "required":
      return `Add the missing property "${e.params.missingProperty}".`;
    case "enum":
      return `Use one of: ${e.params.allowedValues.join(", ")}.`;
    case "const":
      return `Set this field to ${JSON.stringify(e.params.allowedValue)}.`;
    case "type":
      return `Change the value to type ${e.params.type}.`;
    case "minItems":
      return `Provide at least ${e.params.limit} item(s).`;
    case "additionalProperties":
      return `Remove the unknown property "${e.params.additionalProperty}".`;
    default:
      return "Fix the field so it matches the schema.";
  }
}
